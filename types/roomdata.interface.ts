import { BoxStatus } from "./chessboard.enum";
import { GameStatus } from "./room.enum";
import UserData from "./userdata.interface";

interface RoomData {
    users: UserData[];
    chessboard: BoxStatus[][];
    gameStatus: GameStatus;
    blackIsReady: boolean;
    whiteIsReady: boolean;
};

export default RoomData;