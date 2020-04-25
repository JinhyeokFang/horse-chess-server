import { GameStatus } from "./constant/roomEnum";
import { BoxStatus } from "./constant/chessboardEnum";

class Store {
    private static instance;
    private userDataList: any[] = []; // 접속중인 유저 리스트
    public roomDataList: any[] = []; // 방 리스트
    private constructor () {} // 싱글톤이므로 private

    public connectUser(userSocketId: number): void { // 유저 userDataList에 추가
        this.userDataList.push({userSocketId, username: null});
    }

    public disconnectUser(userSocketId: number): void {
        let userDataIndex = this.userDataList.findIndex(user => user.userSocketId == userSocketId); // 유저에 해당하는 인덱스
        this.userDataList.splice(userDataIndex,1);  // 유저 userDataList에서 제거
    }

    public loginUser(userSocketId: number, username: string) {
        let userDataIndex = this.userDataList.findIndex(user => user.userSocketId == userSocketId); // 유저에 해당하는 인덱스
        
        if (this.userDataList[userDataIndex].username === null) { // 로그인 하지 않은 경우
            this.userDataList[userDataIndex].username = username; // username 등록
            return { success: true };
        } else { // 이미 로그인 했거나 없는 유저
            return { success: false, err: "로그인 할 수 없습니다.", users: this.userDataList };
        }
    }

    public createRoom(userSocketId: number) {
        let roomId = this.roomDataList.length;
        this.roomDataList.push({ 
            users: [{userSocketId}], // 방에 입장한 유저리스트, 최대 2명
            chessboard: new Array(8).fill(new Array(8).fill(BoxStatus.Blank)), // 체스 판
            gameStatus: GameStatus.Waiting}); // 게임 진행 상태

        return { success: true, roomId };
    }

    public enterRoom(roomId: number, userSocketId: number) {
        // 유저가 들어가있던 방 인덱스 찾기, 없으면 -1 반환
        let roomIndex = this.roomDataList.findIndex(room => room.users[0].userSocketId == userSocketId); // 0번째 유저인가?
        if (roomIndex != -1)
            roomIndex = this.roomDataList.findIndex(room => room.users.length > 1 && room.users[1].userSocketId == userSocketId); // 1번째 유저인가?
        if (roomIndex != -1) // 이미 유저가 방에 접속한경우
            return { success: false, err: "이미 유저가 방에 접속해있습니다." };

        let numOfUsers = this.roomDataList[roomId].users.length;
        if (numOfUsers == 1) { // 방에 유저가 한명이면
            this.roomDataList[roomId].users.push({userSocketId}); // 유저 추가하고
            this.roomDataList[roomId].gameStatus = GameStatus.InGame; // 게임 시작

            return { success: true, roomId };
        } else { // 접속 불가
            if (numOfUsers == 0)
                return { success: false, err: "잘못된 방입니다. 방에 유저가 존재하지 않습니다." };
            else
                return { success: false, err: "잘못된 방입니다. 방에 유저가 이미 두명이거나 두명 이상입니다." };
        }
    }

    public gameOverByUnexpectedExit(loserSocketId: number) { // 유저가 나가서 게임 종료
        // 유저가 들어가있던 방 인덱스 찾기, 없으면 -1 반환
        let roomIndex = this.roomDataList.findIndex(room =>
            room.users[0].userSocketId == loserSocketId || room.users[1].userSocketId == loserSocketId);

        if (roomIndex == -1) // 없는 방일경우
            return { success: false, err: "방을 찾을 수 없음" }; // 종료

        if (this.roomDataList[roomIndex].gameStatus !== GameStatus.InGame) // 게임을 진행하고 있는 방이 아니라면
            return { success: false, err: "게임을 진행하고있는 방이 아님" }; // 종료

        let winnerData;
        if (this.roomDataList[roomIndex].users[0].userSocketId == loserSocketId) { // 0번째 유저가 나간 사람일 경우
            winnerData = this.userDataList.find(user => user.userSocketId == this.roomDataList[roomIndex].users[1].userSocketId); // 승리한 유저 데이터 전송
        } else { // 1번째일 경우
            winnerData = this.userDataList.find(user => user.userSocketId == this.roomDataList[roomIndex].users[0].userSocketId); // 승리한 유저 데이터 전송
        }

        return { success: true, winner: winnerData };
    }

    public static getInstance(): Store { // 저장소이므로 싱글톤
        if (!Store.instance)
            Store.instance = new Store();

        return Store.instance; 
    }
}

export default Store;