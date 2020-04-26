import Store from '../store'
import Result from '../types/result.interface';
import RoomData from '../types/roomdata.interface';

class MatchingService {
    public getRoomList(): RoomData[] {
        return Store.getInstance().roomDataList;
    }
    
    public enterRoom(userSocketId: string): Result { // 무조건 마지막 방에 입장
        let store: Store = Store.getInstance(); // 저장소 객체 불러오기
        if (store.roomDataList.length == 0 || store.roomDataList[store.roomDataList.length - 1].users.length == 2) { // 방이 없거나 꽉차있는 경우
            let result: Result = store.createRoom(userSocketId); // 새 방을 생성해 입장
            return { success: true, data: { roomId: result.data.roomId } };
        } else if (store.roomDataList[store.roomDataList.length - 1].users.length == 1) { // 방에 한 명이 이미 들어온 경우
            let result: Result = store.enterRoom(store.roomDataList.length - 1, userSocketId);
            if (result.success) {
                return { success: true, data: { roomId: result.data.roomId } };
            } else {
                return { success: false, err: result.err };
            }
        } else { // 알 수 없는 오류
            return { success: false, err: "서버에 문제가 발생했습니다. MatchingService" };
        }
    }
}

export default new MatchingService();