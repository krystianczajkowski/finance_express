var express = require('express');
var router = express.Router();
var auth = require('../auth');
var lookup = require('../lookup');

router.post('/', auth, function(req, res) {
  lookup(req, res, req.body.symbol);
});

router.get('/', auth, function(req, res) {
    res.render('quote.njk', {title: 'Quote', message: 'Check price:'});
});

module.exports = router;
