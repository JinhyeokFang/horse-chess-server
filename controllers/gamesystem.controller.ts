import gameSystemService from '../services/gamesystem.service'
import Result from '../types/result.interface';

class GameSystemController {
    public constructor (messageSender, socket) { // 메세지 입력받을 라우터 등록
        socket.on("getRoomDataRequest", (data): void => this.getRoomData(data, socket));
        socket.on("placeRequest", (data): void => this.place(data, socket));
    }

    public getRoomData (data, socket): void {
        let result: Result = gameSystemService.getRoomData(socket.id);
        socket.emit("getRoomDataResponse", { success: true, data: {roomData: result.data }});
    }

    public place (data, socket): void {
        let { firstX, firstY, secondX, secondY, thirdX, thirdY, fourthX, fourthY } = data;
        let result: Result = gameSystemService.place(socket.id, [
            { x: parseInt(firstX), y: parseInt(firstY) },
            { x: parseInt(secondX), y: parseInt(secondY) },
            { x: parseInt(thirdX), y: parseInt(thirdY) },
            { x: parseInt(fourthX), y: parseInt(fourthY) }
        ]);
        if (result.success) {
            socket.emit("placeResponse", { success: true });
        } else {
            socket.emit("placeResponse", { success: false, err: result.err });
        }      
    }
}

export default GameSystemController;