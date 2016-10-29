var mongoose = require('mongoose');
var MessagesSchema = new mongoose.Schema({
    messages: {
        type: String
    }
});
var Messages = mongoose.model('Messages', MessagesSchema); //
module.exports = Messages;

//postman
