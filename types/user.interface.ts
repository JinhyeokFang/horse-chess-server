import { Document } from 'mongoose';

interface UserModelT extends Document {
    username: string;
    password: string;
    rate: number;
    numOfPlayedGame: number;
    numOfWonGame: number;
    pendingFriendsList: Array<string>;
    friendsList: Array<string>;
    rankingPosition?: number;
};

export default UserModelT;