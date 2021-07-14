const roomModel = require('../database').models.room;
const User = require('../models/user');

const create = function(data, callback) {
    const newRoom = new roomModel(data);
    newRoom.save(callback);
}

const find = function(data, callback) {
    roomModel.find(data, callback);
}

const findOne = funtion(data, callback) {
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