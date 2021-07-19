const config = require('../config');
const redis = require('redis').createClient;
const Room = require('../models/room');
const adapter = require('socket.io-redis');

const ioEvents = function(io) {
    io.of('/rooms').on("connection", function(socket) {
       socket.on('createRoom', function(title) {
           Room.findOne({'title': new RegExp('^' + title + '$', 'i')}, function(err, room) {
               if(err) {throw err;}
               if(room) {
                   socket.emit('updateRoomList', {err: 'Room title already exist'});
               } else {
                   Room.create({
                       title: title
                   }, function(err, newRoom) {
                       if(err) {throw err;}
                       socket.emit('updateRoomList', newRoom);
                       socket.broadcast.emit('updateRoomList', newRoom);
                   });
               }
           });
       });
      });

    io.of('/chatroom').on('connection', function(socket) {
        socket.on('join', function(roomId) {
              Room.findById(roomId, function(err, room) {
                  if(err) {throw err;}
                  if(!room) {
                      socket.emit('updateUsersList', {error: 'Room doesnt exist'});
                  } else {
                      if(socket.request.session.passport = null) {
                          return;
                      }
                      Room.addUser(room, socket, function(err, newRoom) {
                          socket.join(newRoom.id);
                          Room.getUsers(newRoom, socket, function(err, users, countUserInRoom) {
                              if(err) {throw err;}
                              socket.emit('updateUsersList', users, true);

                              if(countUserInRoom === 1) {
                                  socket.broadcast.to(newRoom.id).emit('updateUsersList', users[users.length - 1]);
                              }
                          });
                      });

                  }
              });
        });

        socket.on('disconnect', function() {
        // Check if user exists in the session
			if(socket.request.session.passport == null){
				return;
			}

			// Find the room to which the socket is connected to, 
			// and remove the current user + socket from this room
			Room.removeUser(socket, function(err, room, userId, countUserInRoom){
				if(err) {throw err;}

				// Leave the room channel
				socket.leave(room.id);

				// Return the user id ONLY if the user was connected to the current room using one socket
				// The user id will be then used to remove the user from users list on chatroom page
				if(countUserInRoom === 1){
					socket.broadcast.to(room.id).emit('removeUser', userId);
				}
			});

        socket.on('newMessage', function(roomId, message) {

                // No need to emit 'addMessage' to the current socket
                // As the new message will be added manually in 'main.js' file
                // socket.emit('addMessage', message);
                
                socket.broadcast.to(roomId).emit('addMessage', message);
            });
        });
    });
}

const init = function(app){

	const server 	= require('http').Server(app);
	const io 		= require('socket.io')(server);

	// Force Socket.io to ONLY use "websockets"; No Long Polling.
	io.set('transports', ['websocket']);

	// Using Redis
	let port = config.redis.port;
	let host = config.redis.host;
	let password = config.redis.password;
	let pubClient = redis(port, host, { auth_pass: password });
	let subClient = redis(port, host, { auth_pass: password, return_buffers: true, });
	io.adapter(adapter({ pubClient, subClient }));

	// Allow sockets to access session data
	io.use((socket, next) => {
		require('../sessions')(socket.request, {}, next);
	});

	// Define all Events
	ioEvents(io);

	// The server object will be then used to list to a port number
	return server;
}

module.exports = init;