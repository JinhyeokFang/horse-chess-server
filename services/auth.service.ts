import { encrypt } from '../utils/crypto';
import UserModelT from '../types/user.type';
import UserModel from '../models/user.model';
import Store from '../store';

class AuthService {
    public login(userSocketId: number, username: string, password: string, callback: Function): void {
        let store = Store.getInstance(); //저장소 객체 불러오기

        UserModel.findOne({username: encrypt(username), password: encrypt(password)}, (err: object, res: UserModelT): void => {
            if (err) { // DB 에러
                callback({ message: "failed", err });
            } else if (res == null) { // 없는 유저임
                callback({ message: "failed", err: "찾을수 없는 유저입니다." });
            } else {
                let result = store.loginUser(userSocketId, username); //로그인 시도
                if (result.success) {
                    callback({ message: "complete" });
                } else {
                    callback({ message: "failed", err: result.err });
                }
            }
        });
    }

    public register(userSocketId: number, username: string, password: string, nickname: string, callback: Function): void {
        let store = Store.getInstance(); //저장소 객체 불러오기
        
        UserModel.findOne({username: encrypt(username)}, (err: object, res: UserModelT): void => {
            if (err) { //DB 에러
                callback({ message: "failed", err });
            } else if (res == null) { // 회원가입 되어있지 않은 유저
                new UserModel({username: encrypt(username), password: encrypt(password), nickname, rate: 0}).save((err: object): void => {
                    if (err) { //DB 에러
                        callback({ message: "failed", err });
                    } else {
                        let result = store.loginUser(userSocketId, username); //로그인 시도
                        if (result.success) {
                            callback({ message: "complete" });
                        } else {
                            callback({ message: "failed", err: result.err });
                        }
                    }
                })
            } else { // 이미 회원가입 된 유저
                callback({ message: "failed", err: "이미 존재하는 유저입니다."});
            }
        });
    }
}

export default new AuthService();