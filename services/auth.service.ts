import { encrypt } from '../utils/crypto';
import UserModelT from '../types/user.interface';
import UserModel from '../models/user.model';
import Store from '../store';
import Result from '../types/result.interface';

// 이 서비스는 리펙토링 하기 전까지 promise/async로 구현하지 말것
class AuthService {
    public login(userSocketId: string, username: string, password: string, callback: Function): void {
        let store: Store = Store.getInstance(); //저장소 객체 불러오기

        UserModel.findOne({username: encrypt(username), password: encrypt(password)}, (err: object, res: UserModelT): void => {
            if (err) { // DB 에러
                callback({ message: "failed", err });
            } else if (res == null) { // 없는 유저임
                callback({ message: "failed", err: "찾을수 없는 유저입니다" });
            } else {
                let result: Result = store.loginUser(userSocketId, username); //로그인 시도
                if (result.success) {
                    callback({ message: "complete" });
                } else {
                    callback({ message: "failed", err: result.err });
                }
            }
        });
    }

    public logout(userSocketId: string, callback: Function): void {
        let store: Store = Store.getInstance();
        store.disconnectUser(userSocketId);
        store.connectUser(userSocketId);
        callback({ message: "complete" });
    }

    public register(userSocketId: string, username: string, password: string, nickname: string, callback: Function): void {
        let store: Store = Store.getInstance(); //저장소 객체 불러오기
        
        UserModel.findOne({username: encrypt(username)}, (err: object, res: UserModelT): void => {
            if (err) { //DB 에러
                callback({ message: "failed", err });
            } else if (res == null) { // 회원가입 되어있지 않은 유저
                UserModel.findOne({nickname}, (err: object, res: UserModelT): void => {
                    if (err) { //DB 에러
                        callback({ message: "failed", err });
                    } else if (res == null) { // 닉네임이 겹치지 않으면
                        new UserModel({username: encrypt(username), password: encrypt(password), nickname, rate: 0,
                            numOfPlayedGame: 0, numOfWonGame: 0, pendingFriendsList: [], friendsList: []}).save((err: object): void => {
                            if (err) { //DB 에러
                                callback({ message: "failed", err });
                            } else {
                                let result = store.loginUser(userSocketId, username);
                                if (result.success) {
                                    callback({ message: "complete" });
                                } else {
                                    callback({ message: "failed", err: result.err });
                                }
                            }
                        })
                    } else { // 닉네임이 겹치는 유저
                        callback({ message: "failed", err: "같은 닉네임이 존재합니다"});
                    }
                });
            } else { // 이미 회원가입 된 유저
                callback({ message: "failed", err: "이미 존재하는 유저입니다"});
            }
        });
    }

    public getUserData(username: string, callback: Function): void {
        UserModel.findOne({username: encrypt(username)}, (err: object, res: UserModelT): void => {
            if (err) {
                callback({ message: "failed", err });
            } else if (res == null) {
                callback({ message: "failed", err: "존재하지 않는 유저입니다." });
            } else {
                res.username = username;
                res.password = "";
                UserModel.count({ rate: { "$gte" : res.rate } }, (err: object, count: number): void => {
                    res.ranking = count;
                    callback({ message: "complete", data: { userData: res } });
                });
            }
        });
    }

    public getUsername(userSocketId: string): string | null {
        let store = Store.getInstance();
        return store.getUsername(userSocketId);
    };

    public addFriendRequestment(userSocketId: string, friendname: string, callback: Function): void {
        let store = Store.getInstance();
        let username = store.getUsername(userSocketId);
        let TSdoesntknowusernameisstring;
        if (username == null) {
            callback({ message: "failed", err: "로그인한 유저가 아닙니다." });
            return;
        }
        TSdoesntknowusernameisstring = username;

        UserModel.findOne({ username: encrypt(friendname) }, (err: object, res: UserModelT): void => {
            if (err) {
                callback({ message: "failed", err });
            } else if (res.pendingFriendsList.find((user): boolean => user == username) != undefined) {
                callback({ message: "failed", err: "이미 친구 요청을 보냈습니다." });
            } else if (res.friendsList.find((user): boolean => user == username) != undefined) {
                callback({ message: "failed", err: "이미 친구입니다." });
            } else {
                UserModel.findOne({ username: encrypt(TSdoesntknowusernameisstring) }, (err: object, res: UserModelT): void => {
                    if (err) {
                        callback({ message: "failed", err });
                    } else if (res.pendingFriendsList.find((user): boolean => user == username) !== undefined) {
                        UserModel.updateOne({ username: encrypt(TSdoesntknowusernameisstring) }, { $push: { friendsList: friendname }}, (err): any => {
                            if (err) {
                                callback({ message: "failed", err });
                            } else {
                                UserModel.updateOne({ username: encrypt(friendname) }, { $push: { friendsList: TSdoesntknowusernameisstring }, $pull: { pendingFriendsList: TSdoesntknowusernameisstring } }, (err): any => {
                                    if (err) {
                                        callback({ message: "failed", err });
                                    } else {
                                        callback({ message: "complete", status: "friend" });
                                    }
                                });
                            }
                        });
                    } else {
                        UserModel.updateOne({ username: encrypt(friendname) }, { $push: { pendingFriendsList: friendname }}, (err): any => {
                            if (err) {
                                callback({ message: "failed", err });
                            } else {
                                callback({ message: "complete", status: "pending" });
                            }
                        });
                    }
                });
            }
        });
    };

    public acceptFriendRequestment(userSocketId: string, friendname: string, callback: Function): void {
        let store = Store.getInstance();
        let username = store.getUsername(userSocketId);
        let TSdoesntknowusernameisstring;
        if (username == null) {
            callback({ message: "failed", err: "로그인한 유저가 아닙니다." });
            return;
        }
        TSdoesntknowusernameisstring = username;
        UserModel.findOne({ username: encrypt(username) }, (err: object, res: UserModelT): void => {
            if (err) {
                callback({ message: "failed", err });
            } else if (res.pendingFriendsList.find((user): boolean => user == friendname) == undefined) {
                callback({ message: "failed", err: "친구 요청을 받지 않았습니다." });
            } else if (res.friendsList.find((user): boolean => user == friendname) != undefined) {
                callback({ message: "failed", err: "이미 친구입니다." });
            } else {
                UserModel.updateOne({ username: encrypt(TSdoesntknowusernameisstring) }, { $push: { friendsList: friendname }, $pull: { pendingFriendsList: friendname } }, (err): any => {
                    if (err) {
                        callback({ message: "failed", err });
                    } else {
                        UserModel.updateOne({ username: encrypt(friendname) }, { $push: { friendsList: TSdoesntknowusernameisstring }}, (err): any => {
                            if (err) {
                                callback({ message: "failed", err });
                            } else {
                                callback({ message: "complete", status: "friend" });
                            }
                        });
                    }
                });
            }
        });
    };
}

export default new AuthService();