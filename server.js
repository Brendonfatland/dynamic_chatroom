var express = require('express');
var http = require('http');
var socket_io = require('socket.io');
var app = express();

app.use(express.static('public'));
var server = http.Server(app);
var io = socket_io(server);

var users = []; // array users
var messagesArray = []; // array of messages.

io.on('connection', function(socket) {
	console.log('Client connected.');

  // On submit message
	  socket.on('message', function(message) {
      messagesArray.push(message);
      socket.emit('messages are being recived now', messagesArray);
      console.log('mesages are now being reviedc console', messagesArray);
		console.log('Message received: ', message);
    socket.broadcast.emit('messages array is working', messagesArray);
		socket.broadcast.emit('message', message);
	});

  // On login
	  socket.on('login', function(user) {
		users.push(user);
		socket.emit('get users', users);
		console.log(user + ' just logged in');
		var loginMessage = user + ' just logged in';
		socket.broadcast.emit('message', loginMessage);
		socket.broadcast.emit('new user', user);

    //On disconnet
		socket.on('disconnect', function() {
			users = users.filter(function(name) {
				return name !== user;
			});
			var disconnectMessage = user + ' just logged out.';
			socket.broadcast.emit('message', disconnectMessage);
			socket.broadcast.emit('get users', users);
		});
	});
});

server.listen(process.env.PORT || 8080);
