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
  // GET all users
  .get(function (req, res, next) {
    mongoose.model('User').find({}, function (err, users) {
      if (err) {
        return console.log(err); // CONSIDER: Might want to call next with error.  can add status code and error message.
      } else {
        res.format({
          json: function () {
            res.json(users);
          }
        });
      }
    });
  })
  .post(function (req, res) { // CONSIDER: can add a next parameter for next middleware to run in the middleware chain
    mongoose.model('User').create({
      userName: req.body.userName,
      cellPhone: req.body.cellPhone,
      campusMailbox: req.body.campusMailbox,
      preferences: req.body.preferences || []
    }, function (err, user) {
      if (err) {
        res.send('Problem adding user to db.'); // CONSIDER: Might want to call next with error.  can add status code and error message.
      } else {
        res.format({
          json: function () {
            res.json(user);
          }
        });
      }
    });
  });

// route middleware to validata :id
router.param('id', function (req, res, next, id) {
  mongoose.model('User').findById(id, function (err, user) {
    if (err || user === null) {
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
  mongoose.model('User').findById(req.params.id, function (err, user) {
    if (err) {
      res.status(404);
      errorHandler(err, res, 'GET error, problem retrieving data');
    } else {
      res.format({
        json: function () {
          res.json(user);
        }
      });
    }
  })
}).put(function (req, res, next) {
  mongoose.model('User').findById(req.params.id, function (err, user) {
    user.userName = req.body.userName || user.userName;
    user.cellPhone = req.body.cellPhone || user.cellPhone;
    user.campusMailbox = req.body.campusMailbox || user.campusMailbox;
    user.preferences = req.body.preferences || user.preferences;
    user.save(function (err, updatedUser) {
      if (err) {
        res.status(404);
        errorHandler(err, res, 'PUT error, problem updating data');
      }
      else {
        res.format({
          json: function () {
            res.json(updatedUser);
          }
        });
      }
    });
  })
})
  .delete(function (req, res) {
    mongoose.model('User').findByIdAndRemove(req.params.id, function (err, removed) {
      if (err) {
        res.status(404);
        errorHandler(err, res, 'Problem with deleting user!');
      }
      else {
        res.send('Delete completed successfully!');
      }
    })

  })


module.exports = router;
