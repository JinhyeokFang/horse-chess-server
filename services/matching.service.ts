import Store from '../store'

class MatchingService {
    public getRoomList(): any[] {
        let store = Store.getInstance();
        return store.roomList;
    }
    
    public enterRoom(userSocketId: number): any {
        let store = Store.getInstance();
        if (store.roomList[store.length - 1].users.length == 1) {
            let result = store.enterRoom(store.length - 1, userSocketId);
            if (result.success) {

            } else {
                
            }
        }
        else if (store.roomList[store.length - 1].users.length == 2) {
            let result = store.createRoom(userSocketId);
            if (result.success) {

            } else {

            }
        }
        else {
            return { success: false, err: "서버에 문제가 발생했습니다. MatchingService.EnterRoom" };
        }
    }
}

export default new MatchingService();