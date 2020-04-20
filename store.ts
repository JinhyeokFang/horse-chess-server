import { GameStatus } from "./constant/roomEnum";
import { BoxStatus } from "./constant/chessboardEnum";

class Store {
    private static instance;
    private userDataList: any[] = [];
    private roomDataList: any[] = [];
    private constructor () {}

    public connectUser(userSocketId: number) {
        this.userDataList.push({userSocketId});
    }

    public disconnectUser(userSocketId: number) {
        this.userDataList.splice(this.userDataList.findIndex(user => user.userSocketId == userSocketId),1);
    }

    public createRoom(userSocketId: number) {
        let roomId = this.roomDataList.length - 1;
        this.roomDataList.push({ 
            users: [{userSocketId}], 
            chessboard: new Array(8).fill(new Array(8).fill(BoxStatus.Blank)), 
            gameStatus: GameStatus.Waiting });

        return { success: true, roomId };
    }

    public enterRoom(roomId: number, userSocketId: number) {
        let numOfUsers = this.roomDataList[roomId].users.length;
        if (numOfUsers == 1) {
            this.roomDataList[roomId].users.push({userSocketId});
            this.roomDataList[roomId].gameStatus = GameStatus.InGame;

            return { success: true, room: this.roomDataList[roomId] };
        } else {
            if (numOfUsers != 0)
                return { success: false, err: "잘못된 방입니다. 방에 유저가 존재하지 않습니다." };
            else
                return { success: false, err: "잘못된 방입니다. 방에 유저가 이미 두명이거나 두명 이상입니다." };
        }
    }

    public get userList () {
        return this.userDataList;
    }

    public get roomList () {
        return this.roomDataList;
    }

    public static getInstance() {
        if (!Store.instance)
            Store.instance = new Store();

        return Store.instance; 
    }
}

export default Store;