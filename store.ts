import { GameStatus } from "./constant/roomEnum";
import { BoxStatus } from "./constant/chessboardEnum";

import Position from "./types/position.type";
import Result from "./types/result.type";
import UserData from "./types/userdata.type";
import RoomData from "./types/roomdata.type";

class Store {
    private static instance: Store;
    private userDataList: UserData[] = []; // 접속중인 유저 리스트
    public roomDataList: RoomData[] = []; // 방 리스트
    private constructor () {} // 싱글톤이므로 private

    public connectUser(userSocketId: string): void { // 유저 userDataList에 추가
        this.userDataList.push({userSocketId, username: null});
    }

    public disconnectUser(userSocketId: string): void {
        let userDataIndex: number = this.userDataList.findIndex((user): boolean => user.userSocketId == userSocketId); // 유저에 해당하는 인덱스
        this.userDataList.splice(userDataIndex,1);  // 유저 userDataList에서 제거
    }

    public loginUser(userSocketId: string, username: string): Result {
        let userDataIndex: number = this.userDataList.findIndex((user): boolean => user.userSocketId == userSocketId); // 유저에 해당하는 인덱스
        
        if (this.userDataList[userDataIndex].username === null) { // 로그인 하지 않은 경우
            this.userDataList[userDataIndex].username = username; // username 등록
            return { success: true };
        } else { // 이미 로그인 했거나 없는 유저
            return { success: false, err: "로그인 할 수 없습니다." };
        }
    }

    public createRoom(userSocketId: string): Result {
        let roomId = this.roomDataList.length;
        this.roomDataList.push({ 
            users: [{userSocketId}], // 방에 입장한 유저리스트, 최대 2명
            chessboard: new Array(8).fill(new Array(8).fill(BoxStatus.Blank)), // 체스 판
            gameStatus: GameStatus.Waiting,
            blackIsReady: false,
            whiteIsReady: false}); // 게임 진행 상태

        return { success: true, data: { roomId } };
    }

    public enterRoom(roomId: number, userSocketId: string): Result {
        // 유저가 들어가있던 방 인덱스 찾기, 없으면 -1 반환
        let roomIndex: number = this.roomDataList.findIndex((room): boolean => room.users[0].userSocketId == userSocketId); // 0번째 유저인가?
        if (roomIndex != -1)
            roomIndex = this.roomDataList.findIndex((room): boolean => room.users.length > 1 && room.users[1].userSocketId == userSocketId); // 1번째 유저인가?
        if (roomIndex != -1) // 이미 유저가 방에 접속한경우
            return { success: false, err: "이미 유저가 방에 접속해있습니다." };

        let numOfUsers: number = this.roomDataList[roomId].users.length;
        if (numOfUsers == 1) { // 방에 유저가 한명이면
            this.roomDataList[roomId].users.push({userSocketId}); // 유저 추가하고
            this.roomDataList[roomId].gameStatus = GameStatus.OnReady; // 게임 시작

            return { success: true, data: { roomId } };
        } else { // 접속 불가
            if (numOfUsers == 0)
                return { success: false, err: "잘못된 방입니다. 방에 유저가 존재하지 않습니다." };
            else
                return { success: false, err: "잘못된 방입니다. 방에 유저가 이미 두명이거나 두명 이상입니다." };
        }
    }

    public gameOverByUnexpectedExit(loserSocketId: string): Result { // 유저가 나가서 게임 종료
        let roomIndex = this.getUsersRoomId(loserSocketId);

        if (roomIndex == -1) // 없는 방일경우
            return { success: false, err: "방을 찾을 수 없음" }; // 종료

        if (this.roomDataList[roomIndex].gameStatus !== GameStatus.InGame 
            && this.roomDataList[roomIndex].gameStatus !== GameStatus.OnReady) // 게임을 진행하고 있는 방이 아니라면
            return { success: false, err: "게임을 진행하고있는 방이 아님" }; // 종료

        let winnerData: UserData | undefined;
        if (this.roomDataList[roomIndex].users[0].userSocketId == loserSocketId) { // 0번째 유저가 나간 사람일 경우
            winnerData = this.userDataList.find((user): boolean => 
                user.userSocketId == this.roomDataList[roomIndex].users[1].userSocketId); // 승리한 유저 데이터 전송
        } else { // 1번째일 경우
            winnerData = this.userDataList.find((user): boolean => 
                user.userSocketId == this.roomDataList[roomIndex].users[0].userSocketId); // 승리한 유저 데이터 전송
        }

        return { success: true, data: {winner: winnerData} };
    }

    public setTile(x: number, y: number, color: BoxStatus, roomId: number): Result {
        let room = this.roomDataList[roomId];
        if (color == BoxStatus.White || color == BoxStatus.Black) { // 말을 배치하려는 경우
            if (room.chessboard[x][y] == BoxStatus.Forbidden ||
                color == BoxStatus.White && room.chessboard[x][y] == BoxStatus.Black ||
                color == BoxStatus.Black && room.chessboard[x][y] == BoxStatus.White) { // 갈 수 없는 타일일 경우
                return { success: false, err: "갈 수 없는 곳입니다." };
            } else {
                room.chessboard[x][y] = color;
                return { success: true };
            }
        } else if (color == BoxStatus.Forbidden || color == BoxStatus.Blank) { // 말 이외의 타일로 바꾸려는 경우
            room.chessboard[x][y] = color;
            return { success: true };
        } else if (color == room.chessboard[x][y]) { // 똑같은 색일 경우
            return { success: false, err: "이미 색이 " + color + "인 타일입니다." };
        } else { // 잘못 입력
            return { success: false, err: "잘못된 색입니다." };
        }
        
    }

    public setReady(color: BoxStatus, roomId: number): void {
        if (color == BoxStatus.Black) {
            this.roomDataList[roomId].blackIsReady = true;
        } else {
            this.roomDataList[roomId].whiteIsReady = true;
        }
        if (this.roomDataList[roomId].blackIsReady && this.roomDataList[roomId].whiteIsReady) {
            this.roomDataList[roomId].gameStatus = GameStatus.InGame;
            this.roomDataList[roomId].blackIsReady = false;
            this.roomDataList[roomId].whiteIsReady = false;
        }
    }

    public clearChessboard(roomId: number): void {
        this.roomDataList[roomId].chessboard = new Array(8).fill(new Array(8).fill(BoxStatus.Blank));
    }

    public getUsersRoomId(userSocketId: string): number { // 유저가 들어가있던 방 인덱스 찾기, 없으면 -1 반환
        return this.roomDataList.findIndex((room): boolean =>
            room.users[0].userSocketId == userSocketId || room.users[1].userSocketId == userSocketId);
    }

    public getUsersColor(userSocketId: string): BoxStatus { // 유저의 색깔 찾기, 없으면 Blank 반환
        let roomIndex: number = this.getUsersRoomId(userSocketId);
        
        if (roomIndex == -1) // 색이 없는 경우
            return BoxStatus.Blank;

        if (this.roomDataList[roomIndex].users[0].userSocketId == userSocketId) { // 0번째 유저일 경우
            return BoxStatus.Black;
        } else if (this.roomDataList[roomIndex].users[1].userSocketId == userSocketId) { // 1번째일 경우
            return BoxStatus.White;
        } else {
            return BoxStatus.Blank;
        }
    }

    public findMoveableBoxes(x: number, y: number): Position[] {
        let moveableBoxes: Position[] = [];
        if (x > 1) {
            moveableBoxes.push({x: x-2, y: y-1});
            moveableBoxes.push({x: x-2, y: y+1});
        }
        if (x < 6) {
            moveableBoxes.push({x: x+2, y: y-1});
            moveableBoxes.push({x: x+2, y: y+1});
        }
        if (y > 1) {
            moveableBoxes.push({x: x-1, y: y-2});
            moveableBoxes.push({x: x+1, y: y-2});
        }
        if (y < 6) {
            moveableBoxes.push({x: x-1, y: y+2});
            moveableBoxes.push({x: x+1, y: y+2});
        }

        return moveableBoxes;
    }

    public static getInstance(): Store { // 저장소이므로 싱글톤
        if (!Store.instance)
            Store.instance = new Store();

        return Store.instance; 
    }
}

export default Store;