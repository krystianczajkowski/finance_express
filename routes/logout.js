var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
  // logout logic
  
  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err);
      res.render('login.njk', {title: 'LOGGED OUT', message: 'Log in again'});
    });
  });
});

module.exports = router;