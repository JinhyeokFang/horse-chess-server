import gameSystemService from '../services/gamesystem.service'
import Result from '../types/result.interface';

class GameSystemController {
    public constructor (messageSender, socket) { // 메세지 입력받을 라우터 등록
        socket.on("getRoomDataRequest", (data): void => this.getRoomData(data, socket));
        socket.on("placeRequest", (data): void => this.place(data, messageSender, socket));
        socket.on("turnEndRequest", (data): void => this.turnEnd(data, messageSender, socket));
        socket.on("proposeExtendTimeRequest", (data): void => this.proposeExtendTimeLimits(data, messageSender, socket));
        socket.on("allowExtendTimeRequest", (data): void => this.allowExtendTimeLimits(data, messageSender, socket));
        socket.on("proposeTurnBackRequest", (data): void => this.proposeTurnBack(data, messageSender, socket));
        socket.on("allowTurnBackRequest", (data): void => this.allowTurnBack(data, messageSender, socket));
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
            if (result.data.inGame) {
                let roomData = gameSystemService.getRoomData(socket.id);
                console.log(roomData.data.users[0].userSocketId, roomData.data.users[1].userSocketId)
                messageSender(roomData.data.users[0].userSocketId, "turnStart", { room: result.data });
                messageSender(roomData.data.users[1].userSocketId, "turnStart", { room: result.data });
                messageSender(socket.id, "turnStart", { room: result.data });
                gameSystemService.setTimeLimits(gameSystemService.getRoomId(socket.id), new Date(new Date().getTime() + 60 * 1000));
            }
        } else {
            socket.emit("placeResponse", { success: false, err: result.err });
        }      
    }

    public turnEnd(data, messageSender, socket): void {

    }

    public proposeExtendTimeLimits(data, messageSender, socket): void {

    }

    public allowExtendTimeLimits(data, messageSender, socket): void {

    }

    public proposeTurnBack(data, messageSender, socket): void {

    }

    public allowTurnBack(data, messageSender, socket): void {

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