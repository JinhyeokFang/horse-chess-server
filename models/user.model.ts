import { Schema, model, Model } from 'mongoose';
import UserModelT from '../types/user.interface';

const userSchema = new Schema({
    username: String,
    password: String,
    rate: Number  // 레이팅 점수
});

const UserModel: Model<UserModelT> = model("user", userSchema); // 모델 생성

export default UserModel;