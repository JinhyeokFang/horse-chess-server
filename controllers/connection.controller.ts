import Store from "../store";

class ConnectionController {
    public constructor (messageSender, socket) {
        this.connect(socket)
        socket.on("disconnect", this.disconnect);
    }

    public connect(socket: any): void {
        Store.getInstance().connectUser(socket.id);
        console.dir(Store.getInstance().userList)
    }
    
    public disconnect(socket: any): void {
        Store.getInstance().disconnectUser(socket.id);
    }
}

export default ConnectionController;