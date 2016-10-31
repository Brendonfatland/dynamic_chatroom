var express = require('express');
var http = require('http');
var socket_io = require('socket.io');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.use(express.static('public'));
var server = http.Server(app);
var io = socket_io(server);
var Message = require('./models/Messages'); // going to Messages.js loading shcema to databse then assign to messages object.

var options = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
};
mongoose.connect('mongodb://localhost/chat-room-dev', options); // chat-room-dev is the database.
mongoose.connection.on('connected', function(ref) {
    initApp();
}); //when connected we try to apply express application
process.on('SIGINT', function() { //When you use control in gitbash, this event catches it and shuts down database.
    console.log("Caught interrupt signal");
    mongoose.disconnect(function() {
        console.log("disconnected perfectly.");
        process.exit();
    });
});

function initApp() {

    // app.get('/messages/:usersMessage', function(req, res) {
    //   var usersMessage = req.params.usersMessage;
    //   console.log("The Get is working" + usersMessage);
    //   res.json(Messages);
    //
    // });

    app.get('/messages', function(req, res) {
        Message.find({}, function(err, messages) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            res.json(messages);
        });
    });

    //--------------------------------------------------------

    //Updates Team Roster with WR PID's only
    app.put('/updates', function(req, res) { //app deafult name for express. then do this stuff below. Put messages
        console.log("get a request!");
        // var _id = req.body.team_id; // how to get a field out of the request obejct.

        Message.findOneAndUpdate({ // Method call
            type: String
        }, function(err, items) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            return res.json(items);
        });
    });

    app.post('/input', jsonParser, function(req, res) {
        Message.create({
            name: req.body.name
        }, function(err, message) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            console.log(message);
            res.status(201).json(message);
        });
    });
    //---------------------------------------------------------

    var users = []; // array users
    var messagesArray = []; // array of messages.

    io.on('connection', function(socket) { // accept connection for single user, single socket for user.
        console.log('connected.');
        //Add message find , which gets all messages form DB and send to new clients.
        console.log(users);
        // newMsg.find(err)// return via socket to user. socket.emit
        Message.find({}, function(err, messages){
         for (var msg of messages)
          socket.emit('message', msg); // user who just connected.
        });

        // On submit message
        socket.on('message', function(message) {
            console.log('mesages are now being reviedc console', messagesArray);
            console.log('Message received: ', message);
            //Create message
            var newMsg = new Message({
                msg: message
            });
            //Save it to database
            newMsg.save(function(err, msg) {
                //Send message to those connected in the room
                if (err) return console.error(err); // REally good way of doing all call backs with Function err.

                messagesArray.push(message);
                socket.emit('messages are being recived now', messagesArray);
                console.log('mesages are now being reviedc console', messagesArray);
                console.log('Message received: ', message);
                socket.broadcast.emit('messages array is working', messagesArray);
                socket.broadcast.emit('message', msg);
            });
        });

        // On login
        socket.on('login', function(user) {
            users.push(user);
            socket.emit('get users', users);
            console.log(user + ' just logged in');
            var loginMessage = user + ' just logged in';
            socket.broadcast.emit('message', {msg: loginMessage});
            socket.broadcast.emit('new user', user);

            //On disconnet
            socket.on('disconnect', function() {
                console.log('Client disconnected.');
                users = users.filter(function(name) {
                    return name !== user;
                });
                var disconnectMessage = user + ' just logged out.';
                socket.broadcast.emit('message', {msg: disconnectMessage});
                socket.broadcast.emit('get users', users);
            });
        });
    });

    server.listen(3000, function() {
        console.log('listening on *:3000');
    });
    // server.listen(process.env.PORT || 8080);

}
