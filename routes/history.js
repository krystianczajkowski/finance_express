var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res) {
  res.render('history.njk', {title: 'HISTORY', message: 'your history'});
});

module.exports = router;
