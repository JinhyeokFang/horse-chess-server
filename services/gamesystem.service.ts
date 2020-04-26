import Store from '../store';
import { BoxStatus } from '../constant/chessboardEnum';
import Result from '../types/result.type';
import Position from '../types/position.type';

class GameSystemService {
    public getRoomData(userSocketId: string): Result {
        let store: Store = Store.getInstance();
        let roomId: number = store.getUsersRoomId(userSocketId);
        if (roomId == -1) {
            return { success: false, err: "아직 방에 접속하지 않았습니다." };
        } else {
            return { success: true, data: store.roomDataList[roomId] };
        }
    }

    public place(userSocketId: string, horses: Position[]): Result {
        let store: Store = Store.getInstance();

        let roomId: number = store.getUsersRoomId(userSocketId);
        let color: BoxStatus = store.getUsersColor(userSocketId);

        if (roomId == -1 || color == BoxStatus.Blank)
            return { success: false, err: "접근할 수 없는 유저입니다." };

        if (color == BoxStatus.Black) {
            for (let horse of horses) { // 말 하나씩 배치
                if (horse.y < 4) { // 배치 범위를 벗어나면
                    store.clearChessboard(roomId);
                    return { success: false, err: "잘못된 배치입니다." };
                }
                let result: Result = store.setTile(horse.x, horse.y, color, roomId); // 배치 시도
                if (!result.success) { // 배치에 실패하면
                    store.clearChessboard(roomId);
                    return { success: false, err: result.err };
                }
            }
            store.setReady(color, roomId); // 준비된 상태로 변경
            return { success: true };
        } else if (color == BoxStatus.White) {
            for (let horse of horses) {
                if (horse.y >= 4) { // 배치 범위를 벗어나면
                    store.clearChessboard(roomId);
                    return { success: false, err: "잘못된 배치입니다." };
                }
                let result: Result= store.setTile(horse.x, horse.y, color, roomId); // 배치 시도
                if (!result.success) { // 배치에 실패하면
                    store.clearChessboard(roomId);
                    return { success: false, err: result.err };
                }
            }
            store.setReady(color, roomId); // 준비된 상태로 변경
            return { success: true };
        } else { // 색깔이 흰색, 검은색 모두 아닐경우
            return { success: false, err: "잘못된 플레이어 색깔입니다." };
        }
    }
}

export default new GameSystemService();