import Store from "../store";
import Result from "../types/result.interface";

class ConnectionService {
    public connect(userSocketId: string): void {
        let store = Store.getInstance();
        store.connectUser(userSocketId);
    }

    public disconnect(userSocketId: string): Result {
        let store: Store = Store.getInstance();
        let result: Result = store.gameOverByUnexpectedExit(userSocketId); // 유저가 있던 방 게임 종료
        store.disconnectUser(userSocketId);
        if (result.success) { // 유저가 방에 접속해있었을 경우
            return { success: true, data: {winner: result.data.winner} };
        } else { // 유저가 방에 접속하지 않은 경우
            return { success: true, data: {winner: null} };
        }
    }
}

export default new ConnectionService();