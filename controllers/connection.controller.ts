import connectionService from "../services/connection.service";
import Result from "../types/result.interface";
import authService from "../services/auth.service";

class ConnectionController {
    public constructor (messageSender: Function, socket) { // 메세지 입력받을 라우터 등록
        this.connect(socket, messageSender) // 연결되었으므로 연결 이벤트 실행
        socket.on("disconnect", (): void => this.disconnect(messageSender, socket));
    }

    public connect(socket, messageSender): void {
        connectionService.connect(socket.id, messageSender);
    }
    
    public disconnect(messageSender: Function, socket): void {
        let result: Result = connectionService.disconnect(socket.id);
        if (result.data.winner !== null && result.data.winner !== undefined) { // 만약 유저가 방을 나가 승리한 사람이 있다면
            // 게임이 종료됬다고 전달
            if (result.data.winner.userSocketId !== undefined) {
                authService.updateUserRecord(result.data.winner.username, true, result => {
                    messageSender(result.result.data.userData.userSocketId, "gameOver", {data: { message: "상대방이 나갔습니다.", userData: result.data.userData }}); 
                });
            }
        }
    }
}

export default ConnectionController;