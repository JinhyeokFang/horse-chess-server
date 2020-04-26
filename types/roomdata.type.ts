import { BoxStatus } from "../constant/chessboardEnum";
import { GameStatus } from "../constant/roomEnum";

interface RoomData {
    users: any[];
    chessboard: BoxStatus[][];
    gameStatus: GameStatus;
    blackIsReady: boolean;
    whiteIsReady: boolean;
};

export default RoomData;