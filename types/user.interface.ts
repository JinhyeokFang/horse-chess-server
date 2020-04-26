import { Document } from 'mongoose';

interface UserModelT extends Document {
    username: string;
    password: string;
    rate: number;
};

export default UserModelT;