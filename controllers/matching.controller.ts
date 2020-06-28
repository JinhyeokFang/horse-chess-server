import matchingService from '../services/matching.service'
import Result from '../types/result.interface';

class MatchingController {
    public constructor (messageSender, socket) { // 메세지 입력받을 라우터 등록
        socket.on("getRoomRequest", (data): void => this.getRoom(data, socket));
        socket.on("enterRoomRequest", (data): void => this.enterRoom(data, socket));
        socket.on("matchingCancelRequest", (data): void => this.matchingCancel(data, socket));
    }

    public getRoom(data, socket): void {
        socket.emit("getRoomResponse", { success: true, data: {roomList: matchingService.getRoomList()} });
    }

    public enterRoom(data, socket): void {
        let result: Result = matchingService.enterRoom(socket.id);
        socket.emit("enterRoomResponse", result);
    }

    public matchingCancel(data, socket): void {
        let result: Result = matchingService.matchingCancel(socket.id);
        socket.emit("matchingCancelResponse", result);
    }
}

export default MatchingController;