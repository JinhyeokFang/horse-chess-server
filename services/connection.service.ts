import Store from "../store";
import Result from "../types/result.interface";

class ConnectionService {
    public connect(userSocketId: string, messageSender: Function): void {
        let store = Store.getInstance();
        store.connectUser(userSocketId);
        store.messageSender = messageSender;
    }

    public disconnect(userSocketId: string): Result {
        let store: Store = Store.getInstance();
        store.disconnectUser(userSocketId);
    }
}

export default new ConnectionService();