var express = require('express');
var router = express.Router();
var auth = require('../auth');


/* GET home page. */
router.get('/', auth, function(req, res) {
  res.render('history.njk', {title: 'HISTORY', message: 'your history', session: true});
});

module.exports = router;
