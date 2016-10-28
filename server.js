var express = require('express');
var http = require('http');
var socket_io = require('socket.io');
var mongoose = require('mongoose');
var app = express();

app.use(express.static('public'));
var server = http.Server(app);
var io = socket_io(server);

var options = { server: { socketOptions: { keepAlive: 1 } } };
mongoose.connect('mongodb://localhost/chat-room-dev', options); // chat-room-dev is the database.
mongoose.connection.on('connected', function(ref) { initApp(); }); //when connected we try to apply express application
process.on('SIGINT', function() { //When you use control in gitbash, this event catches it and shuts down database.
    console.log("Caught interrupt signal");
  mongoose.disconnect(function() { console.log("disconnected perfectly."); process.exit(); });
});

function initApp() {





  app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});


var users = []; // array users
var messagesArray = []; // array of messages.

io.on('connection', function(socket) {
	console.log('connected.');
  console.log(users);

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
      console.log('Client disconnected.');
      users = users.filter(function(name) {
				return name !== user;
			});
			var disconnectMessage = user + ' just logged out.';
			socket.broadcast.emit('message', disconnectMessage);
			socket.broadcast.emit('get users', users);
		});
	});
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});
// server.listen(process.env.PORT || 8080);

}
