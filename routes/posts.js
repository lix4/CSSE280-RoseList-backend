var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), // mongodb connection
    bodyParser = require('body-parser'), // parse info from POST
    methodOverride = require('method-override');  // used to manipulate POST data

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body == 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// READY to build our API
router.route('/')
    // GET all posts
    .get(function (req, res, next) {
        mongoose.model('Post').find({}, function (err, posts) {
            if (err) {
                return console.log(err); // CONSIDER: Might want to call next with error.  can add status code and error message.
            } else {
                res.format({
                    json: function () {
                        res.json(posts);
                    }
                });
            }
        });
    })
    .post(function (req, res) { // CONSIDER: can add a next parameter for next middleware to run in the middleware chain
        mongoose.model('Post').create({
            userName: req.body.userName,
            price: req.body.price,
            type: req.body.type,
            category: req.body.category,
            date: new Date(),
            name: req.body.name,
            info: req.body.info,
            email: req.body.email,
            phone: req.body.phone,
            responses: []
        }, function (err, post) {
            if (err) {
                res.send('Problem adding post to db.'); // CONSIDER: Might want to call next with error.  can add status code and error message.
            } else {
                res.format({
                    json: function () {
                        res.json(post);
                    }
                });
            }
        });
    });

// route middleware to validata :id
router.param('id', function (req, res, next, id) {
    mongoose.model('Post').findById(id, function (err, post) {
        if (err || post === null) {
            errorHandler(err, res, 'Not Found');
        } else {
            // once validation is done, save new id in the req
            req.id = id;
            next();
        }
    });
});

function errorHandler(err, res, msg) {
    res.status(404);
    err = new Error(msg);
    err.status = 404;
    res.format({
        // html: function(){
        //     next(err);
        // },
        json: function () {
            res.json({ message: err.status + ' ' + err });
        }
    });
};


// CHALLENGE:  Implement these API endpoints before next class
router.route('/:id').get(function (req, res, next) {
    mongoose.model('Post').findById(req.params.id, function (err, post) {
        if (err) {
            res.status(404);
            errorHandler(err, res, 'GET error, problem retrieving data');
        } else {
            res.format({
                json: function () {
                    res.json(post);
                }
            });
        }
    })
}).put(function (req, res, next) {
    mongoose.model('Post').findById(req.params.id, function (err, post) {
        post.userName = req.body.userName || post.userName;
        post.price = req.body.price || post.price;
        post.type = req.body.type || post.type;
        post.category = req.body.category || post.category;
        post.date = post.date || new Date();
        post.name = req.body.name || post.name;
        post.info = req.body.info || post.info;
        post.responses = req.body.responses || post.responses;
        post.email = req.body.email || post.email;
        post.phone = req.body.phone || post.phone;
        post.save(function (err, updatedPost) {
            if (err) {
                res.status(404);
                errorHandler(err, res, 'PUT error, problem updating data');
            }
            else {
                res.format({
                    json: function () {
                        res.json(updatedPost);
                    }
                });
            }
        });
    })
})
    .delete(function (req, res) {
        mongoose.model('Post').findByIdAndRemove(req.params.id, function (err, removed) {
            if (err) {
                res.status(404);
                errorHandler(err, res, 'Problem with deleting post!');
            }
            else {
                res.send('Delete completed successfully!');
            }
        })

    })


module.exports = router;
