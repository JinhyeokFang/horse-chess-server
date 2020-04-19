import { Schema, model, Model } from 'mongoose';
import UserModelT from '../types/user.type';

const userSchema = new Schema({
    username: String,
    password: String,
    rate: Number
});

const UserModel: Model<UserModelT> = model("user", userSchema);

export default UserModel;