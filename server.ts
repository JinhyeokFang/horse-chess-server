import socketio from 'socket.io'

import config from './config';
import db from './db'
import ConnectionController from './controllers/connection.controller';
import AuthController from './controllers/auth.controller';

db.initialize();

const io = socketio.listen(config.port);

function messageSender (id, messageName, messageData) {
    io.to(id).emit(messageName, messageData);
};

io.origins("*:*");
io.on("connection", socket => {
    new ConnectionController(messageSender, socket)
    new AuthController(messageSender, socket)
});