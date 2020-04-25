import gameService from '../services/game.service'

class GameController {
    public constructor (messageSender, socket) { // 메세지 입력받을 라우터 등록
        // socket.on("getRoomRequest", data => this.getRoom(data, socket));
    }
}

export default GameController;