var RosefireTokenVerifier = require('rosefire-node');

var rosefire = new RosefireTokenVerifier('whatalovelyday');

app.post('/foobar', function (req, res) {
  var token = req.headers.authorization;
  if (!token) {
    res.status(401).json({
      error: 'Not authorized!'
    });
    return;
  }
  token = token.split(' ')[1]; 
  rosefire.verify(token, function(err, authData) {
    if (err) {
      res.status(401).json({
        error: 'Not authorized!'
      });
    } else {
      console.log(authData.username); // rockwotj
      console.log(authData.issued_at); // <Date Object of issued time> 
      console.log(authData.group); // STUDENT (Only there if options asked)
      console.log(authData.expires) // <Date Object> (Only there if options asked)
      res.json(authData);
    }
  });
});