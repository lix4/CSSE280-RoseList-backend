var mongoose = require('mongoose');



var postSchema = new mongoose.Schema({
    userName: String,
    price: Number,
    type: String,
    category: String,
    date: Date,
    info: String,
    name: String,
    phone: String,
    email: String,
    responses: mongoose.Schema.Types.Mixed
});


exports.Post = mongoose.model('Post', postSchema); 
