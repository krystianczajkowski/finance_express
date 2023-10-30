var express = require('express');
var router = express.Router();
var auth = require('../auth')

/* GET users listing. */
router.get('/', auth, function(req, res, next) {
  res.render('users.njk', {title: 'Users', message: 'No users present!', session: true});
});

module.exports = router;
