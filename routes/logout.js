var express = require('express');
var router = express.Router();



/* GET home page. */

router.get('/', function(req, res) {
  sessionStorage.clear();
  res.render('login.njk', {title: 'LOGGED OUT', message: 'Log in again'});
});


module.exports = router;
