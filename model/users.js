var mongoose = require('mongoose');
var userSchema  = new mongoose.Schema({
    userName: String,
    cellPhone: String,
    campusMailbox: Number,
    photo: Blob,
    preferences: [String]
});

mongoose.model('User', userSchema);