import socketio from 'socket.io'

import config from './config';
import db from './db'

import ConnectionController from './controllers/connection.controller';
import AuthController from './controllers/auth.controller';
import MatchingController from './controllers/matching.controller';

db.initialize();

const io = socketio.listen(config.port);

function messageSender (id, messageName, messageData): void { // 특정 유저에게 메세지 전송
    io.to(id).emit(messageName, messageData);
};

io.origins("*:*"); // CORS
io.on("connection", socket => { // 컨트롤러 바인딩
    new ConnectionController(messageSender, socket); // 유저를 연결하고 연결 헤제해줌
    new AuthController(messageSender, socket); // 로그인 관련
    new MatchingController(messageSender, socket); // 유저들을 매칭시켜줌
});