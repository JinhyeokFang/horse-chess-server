import Store from "../store";

class ConnectionService {
    public connect(userSocketId: number): void {
        let store = Store.getInstance();
        store.connectUser(userSocketId);
    }

    public disconnect(userSocketId: number) {
        let store = Store.getInstance();
        let result = store.gameOverByUnexpectedExit(userSocketId); // 유저가 있던 방 게임 종료
        store.disconnectUser(userSocketId);
        if (result.success) { // 유저가 방에 접속해있었을 경우
            return { winner: result.winner };
        } else { // 유저가 방에 접속하지 않은 경우
            return { winner: null };
        }
    }
}

export default new ConnectionService();