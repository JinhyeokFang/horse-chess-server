import { encrypt } from '../utils/crypto';
import UserModelT from '../types/user.type';
import UserModel from '../models/user.model';

class AuthService {
    public login(username: string, password: string, callback: Function): void {
        UserModel.findOne({username: encrypt(username), password: encrypt(password)}, (err: object, res: UserModelT): void => {
            if (err) {
                callback({ message: "failed", err });
            } else if (res == null) {
                callback({ message: "failed", err: "the user not found" });
            } else {
                callback({ message: "complete" });
            }
        });
    }

    public register(username: string, password: string, callback: Function): void {
        UserModel.findOne({username: encrypt(username)}, (err: object, res: UserModelT): void => {
            if (err) {
                callback({ message: "failed", err });
            } else if (res == null) {
                new UserModel({username: encrypt(username), password: encrypt(password), rate: 0}).save((err: object): void => {
                    if (err)
                        callback({ message: "failed", err });
                    else
                        callback({ message: "complete" });
                })
            } else {
                callback({ message: "failed", err: "the user already exist."});
            }
        });
    }
}

export default new AuthService();