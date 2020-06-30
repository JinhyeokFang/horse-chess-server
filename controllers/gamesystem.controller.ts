import gameSystemService from '../services/gamesystem.service'
import Result from '../types/result.interface';
import { GameStatus } from '../types/room.enum';

class GameSystemController {
    public constructor (messageSender, socket) { // 메세지 입력받을 라우터 등록
        socket.on("getRoomDataRequest", (data): void => this.getRoomData(data, socket));
        socket.on("placeRequest", (data): void => this.place(data, messageSender, socket));
        socket.on("turnEndRequest", (data): void => this.turnEnd(data, messageSender, socket));
        socket.on("proposeExtendTimeRequest", (data): void => this.proposeExtendTimeLimits(data, messageSender, socket));
        socket.on("allowExtendTimeRequest", (data): void => this.allowExtendTimeLimits(data, messageSender, socket));
        socket.on("proposeTurnBackRequest", (data): void => this.proposeTurnBack(data, messageSender, socket));
        socket.on("allowTurnBackRequest", (data): void => this.allowTurnBack(data, messageSender, socket));
        socket.on("stalemateRequest", (data): void => this.stalemate(data, messageSender, socket));
        socket.on("surrenderRequest", (data): void => this.surrender(data, messageSender, socket));
    }

    public getRoomData (data, socket): void {
        let result: Result = gameSystemService.getRoomData(socket.id);
        socket.emit("getRoomDataResponse", { success: true, data: {roomData: result.data }});
    }

    public place (data, messageSender, socket): void {
        let { firstX, firstY, secondX, secondY, thirdX, thirdY, fourthX, fourthY } = data;
        let result: Result = gameSystemService.place(socket.id, [
            { x: parseInt(firstX), y: parseInt(firstY) },
            { x: parseInt(secondX), y: parseInt(secondY) },
            { x: parseInt(thirdX), y: parseInt(thirdY) },
            { x: parseInt(fourthX), y: parseInt(fourthY) }
        ]);
        if (result.success) {
            socket.emit("placeResponse", { success: true });
            if (result.data.gameStatus == GameStatus.InGame) {
                let roomData = gameSystemService.getRoomData(socket.id);
                gameSystemService.setTimeLimits(gameSystemService.getRoomId(socket.id), new Date(new Date().getTime() + 60 * 1000));
                messageSender(roomData.data.users[0].userSocketId, "turnStart", { data: result.data });
                messageSender(roomData.data.users[1].userSocketId, "turnStart", { data: result.data });
            }
        } else {
            socket.emit("placeResponse", { success: false, err: result.err });
        }      
    }

    public turnEnd(data, messageSender, socket): void {
        let { beforeX, beforeY, afterX, afterY } = data;
        let result: Result = gameSystemService.turnEnd(socket.id, beforeX, beforeY, afterX, afterY);
        if (result.success) {
            messageSender(result.data.room.users[0].userSocketId, "turnStart", { data: result.data });
            messageSender(result.data.room.users[1].userSocketId, "turnStart", { data: result.data });
        } else {
            console.error("TurnEndError");
        }
    }

    public proposeExtendTimeLimits(data, messageSender, socket): void {
        let result: Result = gameSystemService.getRoomData(socket.id);
        if (result.success) {
            messageSender(result.data.users.find((user): boolean => user.userSocketId !== socket.id).userSocketId, "proposeExtendTimeLimits", {});
        } else {
            socket.emit("proposeExtendTimeLimitsResponse", { success: false, err: result.err });
        }
    }

    public allowExtendTimeLimits(data, messageSender, socket): void {
        let result: Result = gameSystemService.allowExtendTimeLimits(socket.id);
        messageSender(result.data.users[0].userSocketId, "updateTimeLimits", { data: result.data });
        messageSender(result.data.users[1].userSocketId, "updateTimeLimits", { data: result.data });
    }

    public proposeTurnBack(data, messageSender, socket): void {
        let result: Result = gameSystemService.getRoomData(socket.id);
        if (result.success) {
            messageSender(result.data.users.find((user): boolean => user.userSocketId !== socket.id).userSocketId, "proposeTurnBack", {});
        } else {
            socket.emit("proposeTurnBackResponse", { success: false, err: result.err });
        }
    }

    public allowTurnBack(data, messageSender, socket): void {
        let result: Result = gameSystemService.allowTurnBack(socket.id);
        messageSender(result.data.users[0].userSocketId, "turnBack", { data: result.data });
        messageSender(result.data.users[1].userSocketId, "turnBack", { data: result.data });
    }

    public stalemate(data, messageSender, socket): void {
        let result: Result = gameSystemService.surrender(socket.id);
        
        if (result.data.winner !== null && result.data.winner !== undefined) { // 만약 유저가 방을 나가 승리한 사람이 있다면
            // 게임이 종료됬다고 전달
            if (result.data.winner.userSocketId !== undefined)
                messageSender(result.data.winner.userSocketId, "gameOver", {data: { message: "더 이상 움직일 수 없습니다", winner: result.data.winner.userSocketId }}); 

            socket.emit("gameOver", {data: { message: "더 이상 움직일 수 없습니다", winner: result.data.winner.userSocketId }});
        }
    }

    public surrender(data, messageSender, socket): void {
        let result: Result = gameSystemService.surrender(socket.id);
        
        if (result.data.winner !== null && result.data.winner !== undefined) { // 만약 유저가 방을 나가 승리한 사람이 있다면
            // 게임이 종료됬다고 전달
            if (result.data.winner.userSocketId !== undefined)
                messageSender(result.data.winner.userSocketId, "gameOver", {data: { message: "게임을 포기했습니다", winner: result.data.winner.userSocketId }}); 

            socket.emit("gameOver", {data: { message: "게임을 포기했습니다", winner: result.data.winner.userSocketId }});
        }
    }
}

export default GameSystemController;