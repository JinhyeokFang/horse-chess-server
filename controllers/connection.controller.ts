import connectionService from "../services/connection.service";

class ConnectionController {
    public constructor (messageSender: Function, socket) { // 메세지 입력받을 라우터 등록
        this.connect(socket) // 연결되었으므로 연결 이벤트 실행
        socket.on("disconnect", data => this.disconnect(messageSender, socket));
    }

    public connect(socket: any): void {
        connectionService.connect(socket.id);
    }
    
    public disconnect(messageSender: Function, socket: any): void {
        let result = connectionService.disconnect(socket.id);
        if (result.winner !== null) { // 만약 유저가 방을 나가 승리한 사람이 있다면
            // 게임이 종료됬다고 전달
            messageSender(result.winner.userSocketId, "gameOver", { message: "상대방이 나갔습니다.", winner: result.winner.userSocketId }); 
        }
    }
}

export default ConnectionController;