import authService from '../services/auth.service'
import Result from '../types/result.interface';

class AuthController {
    public constructor (messageSender, socket) { // 메세지 입력받을 라우터 등록
        socket.on("loginRequest", (data): void => this.login(data, socket));
        socket.on("registerRequest", (data): void => this.register(data, socket));
        socket.on("pushFriendReqRequest", (data): void => this.pushFriendRequestment(data, socket));
        socket.on("acceptFriendReqRequest", (data): void => this.acceptFriendRequestment(data, socket));
    }

    public login(data, socket): void {
        let { username, password } = data;
        
        authService.login(socket.id, username, password, (result: Result): void => {
            if (result.err) {
                socket.emit("loginResponse", { success: false, err: result.err });
            } else {
                authService.getUserData(username, (result: Result): void => {
                    if (result.err) {
                        socket.emit("loginResponse", { success: false, err: result.err });
                    } else {
                        socket.emit("loginResponse", { success: true, data: {userData: result.data.userData} });
                    }
                });
            }
        });
    }
    
    public register(data, socket): void {
        let { username, password, nickname } = data;  
        authService.register(socket.id, username, password, nickname, (result: Result): void => {
            if (result.err) {
                socket.emit("registerResponse", { success: false, err: result.err });
            } else {
                authService.getUserData(username, (result: Result): void => {
                    if (result.err) {
                        socket.emit("registerResponse", { success: false, err: result.err });
                    } else {
                        socket.emit("registerResponse", { success: true, data: {userData: result.data.userData} });
                    }
                });
            }
        });
    }

    public pushFriendRequestment(data, socket): void {
        let { friendname } = data;
        authService.addFriendRequestment(socket.id, friendname, (result: Result): void => {
            if (result.err) {
                socket.emit("pushFriendReqResponse", { success: false, err: result.err });
            } else {
                socket.emit("pushFriendReqResponse", { success: false, data: { status: result.data.status } });
            }
        });
    }

    public acceptFriendRequestment(data, socket): void {
        let { friendname } = data;
        authService.acceptFriendRequestment(socket.id, friendname, (result: Result): void => {
            if (result.err) {
                socket.emit("acceptFriendReqResponse", { success: false, err: result.err });
            } else {
                socket.emit("acceptFriendReqResponse", { success: false, data: { status: result.data.status } });
            }
        });
    }
}


export default AuthController;