import matchingService from '../services/matching.service'
import Result from '../types/result.interface';

class MatchingController {
    public constructor (messageSender, socket) { // 메세지 입력받을 라우터 등록
        socket.on("getRoomRequest", (data): void => this.getRoom(data, socket));
        socket.on("enterRoomRequest", (data): void => this.enterRoom(data, socket));
    }

    public getRoom(data, socket): void {
        socket.emit("getRoomResponse", { success: true, roomList: matchingService.getRoomList() });
    }

    public enterRoom(data, socket): void {
        let result: Result = matchingService.enterRoom(socket.id);
        socket.emit("enterRoomResponse", result);
    }
}

export default MatchingController;