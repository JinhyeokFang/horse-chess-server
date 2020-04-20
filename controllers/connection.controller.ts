import connectionService from "../services/connection.service";

class ConnectionController {
    public constructor (messageSender, socket) {
        this.connect(socket)
        socket.on("disconnect", this.disconnect);
    }

    public connect(socket: any): void {
        connectionService.connect(socket.id);
    }
    
    public disconnect(socket: any): void {
        connectionService.disconnect(socket.id);
    }
}

export default ConnectionController;