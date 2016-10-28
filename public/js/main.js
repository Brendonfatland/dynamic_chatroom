$(document).ready(function() {
  var socket = io(); // Connect to server and allow you to connect and recive messages
  var input = $('#userInput');
  var messages = $('#messages'); // adds message to js to be manipulated.
  var userlist = $('.user');
  var activeUser = $("#activeUsers"); // Targets element in index.html useable to connect to server.

   var userName = prompt('What is your name?') ;

//swal({
//   title: "An input!",
//   text: "Write something interesting:",
//   type: "input",
//   showCancelButton: true,
//   closeOnConfirm: false,
//   animation: "slide-from-top",
//   inputPlaceholder: "Write something"
// },
// function(inputValue){
//   if (inputValue === false) return false;
//
//   if (inputValue === "") {
//     swal.showInputError("You need to write something!");
//     return false
//   }
//
//   swal("Nice!", "You wrote: " + inputValue, "success");
// }); ;




  var addMessage = function (message) {
		messages.append('<div>' + userName + message + '</div>');
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

	socket.emit('login', userName);

  input.on('keydown', function(event) {
		if (event.keyCode != 13) {
			return;
		}

        var message = userName + ': ' + input.val();
        addMessage(message);
        socket.emit('message', message);
        input.val('');
    });




  });
