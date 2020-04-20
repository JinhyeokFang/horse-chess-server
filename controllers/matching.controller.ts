import matchingService from '../services/matching.service'

class MatchingController {
    // private store = Store.getInstance();
    public constructor (messageSender, socket) {
        socket.on("getRoomRequest", data => this.getRoom(data, socket));
    }

    public getRoom(data: any, socket: any): void {
        socket.emit("getRoomResponse", { success: true, roomList: matchingService.getRoomList() })
    }

    public enterRoom(data: any, socket: any): void {
        let { roomId } = data;

    }
}


export default MatchingController;