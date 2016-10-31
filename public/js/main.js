$(document).ready(function() {
  var socket = io(); // Connect to server and allow you to connect and recive messages
  var input = $('#userInput');
  var messages = $('#messages'); // adds message to js to be manipulated.
  var userlist = $('.user');
  var activeUser = $("#activeUsers"); // Targets element in index.html useable to connect to server.

   var userName = prompt('What is your name?') ;
   socket.emit('login', userName);

  var addMessage = function (message) {
		messages.append('<div>'+ message.created + " "+ message.msg + '</div>');
	};
  socket.on('message', addMessage);

  var addUser = function (user) {
		userlist.append('<div>' + user + '</div>');
	};
  socket.on('new user', addUser);

	var getUsers = function (users) {
		userlist.empty(); // Clears out user list so the user being added is only the new one.
		users.forEach(function(user){
			addUser(user);
		});
	};
  socket.on('get users', getUsers);

  $('form').submit(function(){
  var message = userName + ': ' + $('#userInput').val();
  socket.emit('message', message );
  addMessage({msg: message}); // Put time stamp here. 
  $('#userInput').val('');
  return false;
});
});
