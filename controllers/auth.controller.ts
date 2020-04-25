import authService from '../services/auth.service'

class AuthController {
    public constructor (messageSender, socket) { // 메세지 입력받을 라우터 등록
        socket.on("loginRequest", data => this.login(data, socket));
        socket.on("registerRequest", data => this.register(data, socket));
    }

    public login(data: any, socket: any): void {
        let { username, password } = data;
        
        authService.login(socket.id, username, password, (result: any): void => {
            if (result.err) {
                socket.emit("loginResponse", {success: false, err: result.err })
            } else {
                socket.emit("loginResponse", {success: true, username })
            }
        });
    }
    
    public register(data: any, socket: any): void {
        let { username, password, nickname } = data;  
        authService.register(socket.id, username, password, nickname, (result: any): void => {
            if (result.err) {
                socket.emit("registerResponse", {success: false, err: result.err })
            } else {
                socket.emit("registerResponse", {success: true, username })
            }
        });
    }
}


export default AuthController;