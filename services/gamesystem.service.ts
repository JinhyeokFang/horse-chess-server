import Store from '../store';
import { BoxStatus } from '../types/chessboard.enum';
import Result from '../types/result.interface';
import Position from '../types/position.interface';
import { GameStatus } from '../types/room.enum';

class GameSystemService {
    public getRoomData(userSocketId: string): Result {
        let store: Store = Store.getInstance();
        let roomId: number = store.getUsersRoomId(userSocketId);
        if (roomId == -1) {
            return { success: false, err: "아직 방에 접속하지 않았습니다" };
        } else {
            return { success: true, data: store.roomDataList[roomId] };
        }
    }
    
    public getRoomId(userSocketId: string): number {
        let store: Store = Store.getInstance();
        return store.getUsersRoomId(userSocketId);
    }

    public place(userSocketId: string, horses: Position[]): Result {
        let store: Store = Store.getInstance();

        let roomId: number = store.getUsersRoomId(userSocketId);
        let color: BoxStatus = store.getUsersColor(userSocketId);

        if (roomId == -1 || color == BoxStatus.Blank)
            return { success: false, err: "접근할 수 없는 유저입니다" };

        if (color == BoxStatus.Black) {
            console.log(horses);
            for (let horse of horses) { // 말 하나씩 배치
                let result: Result = store.setTile(horse.x, horse.y, color, roomId); // 배치 시도
                if (!result.success) { // 배치에 실패하면
                    store.clearChessboard(roomId);
                    return { success: false, err: result.err };
                }
            }
            store.setReady(color, roomId); // 준비된 상태로 변경
            return { success: true, data: { inGame: store.setReady(color, roomId) }  };
        } else if (color == BoxStatus.White) {
            for (let horse of horses) {
                let result: Result = store.setTile(horse.x, horse.y, color, roomId); // 배치 시도
                if (!result.success) { // 배치에 실패하면
                    store.clearChessboard(roomId);
                    return { success: false, err: result.err };
                }
            }
            store.setReady(color, roomId); // 준비된 상태로 변경
            return { success: true, data: { inGame: store.setReady(color, roomId) } };
        } else { // 색깔이 흰색, 검은색 모두 아닐경우
            return { success: false, err: "잘못된 플레이어 색깔입니다" };
        }
    }

    public setTimeLimits(roomId: number, time: Date): void {
        let store = Store.getInstance();
        console.log(time.getUTCDate());
        store.setTimeLimits(roomId, time);
    }

    public turnEnd(data, messageSender, socket): void {

    }

    public proposeExtendTimeLimits(data, messageSender, socket): void {

    }

    public allowExtendTimeLimits(data, messageSender, socket): void {

    }

    public proposeTurnBack(data, messageSender, socket): void {

    }

    public allowTurnBack(data, messageSender, socket): void {

    }

    public surrender(userSocketId: string): Result {
        let store = Store.getInstance();
        let roomData = this.getRoomData(userSocketId);
        if (!roomData.success || roomData.data.gameStatus !== GameStatus.InGame) {
            return { success: false, err: "잘못된 요청입니다." };
        } else {
            let result: Result = store.gameOverByUnexpectedExit(userSocketId);
            return result;
        }
    }
}

export default new GameSystemService();