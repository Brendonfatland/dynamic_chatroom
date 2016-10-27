$(document).ready(function() {
  var socket = io(); // Connect to server and allow you to connect and recive messages
  var input = $('input');
  var messages = $('#userDiv'); // adds message to js to be manipulated.
  var userlist = $('#user-div');
  var activeUser = $("#activeUsers"); // Targets element in index.html useable to connect to server.

  var userName = swal({
  title: "An input!",
  text: "Write something interesting:",
  type: "input",
  showCancelButton: true,
  closeOnConfirm: false,
  animation: "slide-from-top",
  inputPlaceholder: "Write something"
},
function(inputValue){
  if (inputValue === false) return false;

  if (inputValue === "") {
    swal.showInputError("You need to write something!");
    return false
  }

  swal("Nice!", "You wrote: " + inputValue, "success");
}); ;




  var addMessage = function (message) {
		messages.append('<div>' + userName + message + '</div>');
	};
  var addUser = function (user) {
		userlist.append('<div>' + user + '</div>');
	};
	var getUsers = function (users) {
		userlist.empty(); // Clears out user list so the user being added is only the new one.
		users.forEach(function(user){
			addUser(user);
		});
	};

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

    socket.on('message', addMessage);
  	socket.on('new user', addUser);
  	socket.on('get users', getUsers);
  });
