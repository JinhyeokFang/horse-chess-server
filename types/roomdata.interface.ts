import { BoxStatus } from "./chessboard.enum";
import { GameStatus } from "./room.enum";

interface RoomData {
    users: any[];
    chessboard: BoxStatus[][];
    gameStatus: GameStatus;
    blackIsReady: boolean;
    whiteIsReady: boolean;
};

export default RoomData;