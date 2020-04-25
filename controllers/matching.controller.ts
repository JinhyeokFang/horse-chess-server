import matchingService from '../services/matching.service'

class MatchingController {
    public constructor (messageSender, socket) { // 메세지 입력받을 라우터 등록
        socket.on("getRoomRequest", data => this.getRoom(data, socket));
        socket.on("enterRoomRequest", data => this.enterRoom(data, socket));
    }

    public getRoom(data: any, socket: any): void {
        socket.emit("getRoomResponse", { success: true, roomList: matchingService.getRoomList() })
    }

    public enterRoom(data: any, socket: any): void {
        let { roomId } = data;
        let result = matchingService.enterRoom(socket);
        socket.emit("enterRoomResponse", result);
    }
}

export default MatchingController;