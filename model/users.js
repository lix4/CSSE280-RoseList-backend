var mongoose = require('mongoose');
var userSchema  = new mongoose.Schema({
    userName: String,
    cellPhone: String,
    campusMailbox: Number,
    preferences: [String]
});

mongoose.model('User', userSchema);