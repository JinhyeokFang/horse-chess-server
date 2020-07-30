import { BoxStatus } from "./chessboard.enum";
import { GameStatus } from "./room.enum";
import UserData from "./userdata.interface";

interface RoomData {
    users: UserData[];
    chessboard: BoxStatus[][];
    chessboardTempOne: BoxStatus[][] | null;
    chessboardTempTwo: BoxStatus[][] | null;
    chessboardTempThree: BoxStatus[][] | null;
    chessboardTempFour: BoxStatus[][] | null;
    gameStatus: GameStatus;
    blackIsReady: boolean;
    whiteIsReady: boolean;
    turn: BoxStatus;
    blackDataIndex: number;
    timeLimits: Date | null;
};

export default RoomData;