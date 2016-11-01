var mongoose = require('mongoose');
var postSchema  = new mongoose.Schema({
    userName: String,
    postID: Number,
    price: Number,
    type: String,
    category: String,
    image: Blob,
    date: Date,
    description: [],
    replyID: Number,
    responses: []
});

mongoose.model('Post', postSchema);