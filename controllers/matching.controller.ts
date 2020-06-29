import matchingService from '../services/matching.service'
import authService from '../services/auth.service'
import Result from '../types/result.interface';
import gamesystemService from '../services/gamesystem.service';

class MatchingController {
    public constructor (messageSender, socket) { // 메세지 입력받을 라우터 등록
        socket.on("getRoomRequest", (data): void => this.getRoom(data, socket));
        socket.on("enterRoomRequest", (data): void => this.enterRoom(data, messageSender, socket));
        socket.on("matchingCancelRequest", (data): void => this.matchingCancel(data, socket));
    }

    public getRoom(data, socket): void {
        socket.emit("getRoomResponse", { success: true, data: {roomList: matchingService.getRoomList()} });
    }

    public enterRoom(data, messageSender, socket): void {
        let result: Result = matchingService.enterRoom(socket.id);
        socket.emit("enterRoomResponse", result);
        if (result.success && result.data.room.users.length == 2) {
            let userData = result.data.room.users;
            authService.getUserData(result.data.room.users[0].username, (firstResult): void => {
                authService.getUserData(result.data.room.users[1].username, (secondResult): void => {
                    gamesystemService.setTimeLimits(result.data.roomId, new Date(new Date().getTime() + 2 * 60 * 1000));

                    messageSender(userData[0].userSocketId, "matchingSuccess", { data: {first: result.data.room.blackDataIndex == 1},
                        users: [firstResult.data.userData, secondResult.data.userData], room: result.data.room });
                    messageSender(userData[1].userSocketId, "matchingSuccess", { data: {first: result.data.room.blackDataIndex == 0},
                        users: [firstResult.data.userData, secondResult.data.userData], room: result.data.room });
                });
            });
        }
    }   

    public matchingCancel(data, socket): void {
        let result: Result = matchingService.matchingCancel(socket.id);
        socket.emit("matchingCancelResponse", result);
    }
}

export default MatchingController;