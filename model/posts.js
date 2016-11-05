var mongoose = require('mongoose');
var postSchema  = new mongoose.Schema({
    userName: String,
    price: Number,
    type: String,
    category: String,
    date: Date,
    description: {
        info: String,
        name: String,
    },
    responses: [String]
});

mongoose.model('Post', postSchema);