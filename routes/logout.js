var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  res.render('login.njk', {title: 'LOGGED OUT', message: 'Log in again'});
});

module.exports = router;
