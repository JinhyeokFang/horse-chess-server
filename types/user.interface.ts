import { Document } from 'mongoose';

interface UserModelT extends Document {
    username: string;
    password: string;
    nickname: string;
    ranking: number;
    rate: number;
    numOfPlayedGame: number;
    numOfWonGame: number;
    pendingFriendsList: string[];
    friendsList: string[];
    rankingPosition?: number;
};

export default UserModelT;