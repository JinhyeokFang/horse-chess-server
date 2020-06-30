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
            for (let horse of horses) { // 말 하나씩 배치
                let result: Result = store.setTile(horse.x, horse.y, BoxStatus.Black, roomId); // 배치 시도
                console.log(horse.x, horse.y, color);
                if (!result.success) { // 배치에 실패하면
                    return { success: false, err: result.err };
                }
            }
            store.setReady(color, roomId);
            return { success: true, data: store.getRoom(store.getUsersRoomId(userSocketId)) };
        } else if (color == BoxStatus.White) {
            for (let horse of horses) {
                let result: Result = store.setTile(horse.x, horse.y, BoxStatus.White, roomId); // 배치
                console.log(horse.x, horse.y, color);
                if (!result.success) { // 배치에 실패하면
                    return { success: false, err: result.err };
                }
            }
            store.setReady(color, roomId);
            return { success: true, data: store.getRoom(store.getUsersRoomId(userSocketId)) };
        } else { // 색깔이 흰색, 검은색 모두 아닐경우
            return { success: false, err: "잘못된 플레이어 색깔입니다" };
        }
    }

    public setTimeLimits(roomId: number, time: Date): void {
        let store = Store.getInstance();
        console.log(time.getUTCDate());
        store.setTimeLimits(roomId, time);
    }

    public turnEnd(userSocketId: string, beforeX: number, beforeY: number, afterX: number, afterY: number): Result {
        let store: Store = Store.getInstance();
        let roomId: number = store.getUsersRoomId(userSocketId);
        let color: BoxStatus = store.getUsersColor(userSocketId);

        if (roomId === -1)
            return { success: false, err: "방에 입장하지 않았습니다" };

        store.setTile(beforeX, beforeY, BoxStatus.Blank, roomId);
        store.setTile(afterX, afterY, color, roomId);

        store.changeTurn(roomId);
    
        return { success: true, data: {room: store.getRoom(roomId)} };
    }

    public allowExtendTimeLimits(userSocketId: string): Result {
        let store: Store = Store.getInstance();
        let roomId: number = store.getUsersRoomId(userSocketId);
        store.extendTimeLimits(roomId);

        return { success: true, data: {room: store.getRoom(roomId)} };
    }

    public allowTurnBack(userSocketId: string): Result {
        let store: Store = Store.getInstance();
        let roomId: number = store.getUsersRoomId(userSocketId);
        store.turnBack(roomId);

        return { success: true, data: {room: store.getRoom(roomId)} };
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