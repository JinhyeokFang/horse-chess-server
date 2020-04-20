import Store from "../store";

class ConnectionService {
    public connect(userSocketId: number): void {
        Store.getInstance().connectUser(userSocketId);
    }

    public disconnect(userSocketId: number): void {
        Store.getInstance().disconnectUser(userSocketId);
    }
}

export default new ConnectionService();