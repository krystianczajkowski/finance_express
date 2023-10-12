var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users.njk', {title: 'USERS', message: 'No users present!'});
});

module.exports = router;
