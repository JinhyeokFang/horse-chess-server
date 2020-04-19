import authService from '../services/auth.service'
import Store from '../store'

class AuthController {
    private store = Store.getInstance();

    public constructor (messageSender, socket) {
        socket.on("loginRequest", data => this.login(data, socket));
        socket.on("registerRequest", data => this.register(data, socket));
    }

    public login(data: any, socket: any): void {
        let { username, password } = data;
        
        authService.login(username, password, (result: any): void => {
            if (result.err) {
                socket.emit("loginResponse", {success: false, err: result.err })
            } else {
                socket.emit("loginResponse", {success: true, username })
            }
        });
    }
    
    public register(data: any, socket: any): void {
        let { username, password } = data;  
        console.log("register")
        authService.register(username, password, (result: any): void => {
            if (result.err) {
                socket.emit("registerResponse", {success: false, err: result.err })
            } else {
                socket.emit("registerResponse", {success: true, username })
            }
        });
    }
}


export default AuthController;