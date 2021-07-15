const roomModel = require('../database').models.room;
const User = require('../models/user');

const create = function(data, callback) {
    const newRoom = new roomModel(data);
    newRoom.save(callback);
}

const find = function(data, callback) {
    roomModel.find(data, callback);
}

const findOne = function(data, callback) {
    roomModel.findOne(data, callback);
}

const findById = function(data, callback) {
    roomModel.findById(data, callback);
}

const findByIdAndUpdate = function(id, data, callback) {
    roomModel.findByIdAndUpdate(id, data, {new: true}, callback)
}

const addUser = function(room, socket, callback) {
    const userId = socket.request.session.passport.user;

    const conn = {userId: userId, socketId: socket.id};
    room.connections.push(conn);
    room.save(callback);
}

const getUsers = function(room, socket, callback) {
    const users = [];
    const vis = {};
    const count = 0;
    const userId = socket.request.session.passport.user;

    room.connections.forEach(function(conn) {
        if(conn.userId === userId) {
            count++;
        }
        if(!vis[conn.userId]) {
            users.push(conn.userId);
        }
        vis[conn.userId] = true;
    });

    const loadedUsers = 0;
    users.forEach(function(userId, i) {
        User.findById(userId, function(err, user) {
            if(err) {
                return callback(err);
            }
            users[i] = user;

            if(++loadedUsers === users.length) {
                return callback(null, users, count);
            }
        });
    });
}

const removeUser = function(socket, callback) {
    const userId = socket.request.session.passport.user;

    find(function(err, rooms) {
        if(err) {
            return callback(err);
        }
        rooms.every(function(room) {
            const pass = true;
            const count = 0;
            const target = 0;

            room.connections.forEach(function(conn, i) {
                if(conn.userId === userId) {
                    count++;
                }
                if(conn.socketId === socket.id) {
                    pass = false, target = i;
                }
            });
            if(!pass) {
                room.connections.id(room.connections[target]._id).remove();
                room.save(function(err) {
                    callback(err, room, userId, count);
                });
            }
            return pass;
        });
    });
}

module.exports = {
    create,
    find,
    findOne,
    findById,
    getUsers,
    removeUser
};