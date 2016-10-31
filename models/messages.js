var mongoose = require('mongoose');
var MessageSchema = new mongoose.Schema({
        msg: { type: String, required: true },
        created: {type: Date, default:Date.now}

});


var Message = mongoose.model('Message', MessageSchema); //compiling our schema into a model
module.exports = Message; // Exporting module through project

//postman
