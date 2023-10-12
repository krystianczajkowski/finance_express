var express = require('express');
var router = express.Router();



/* GET home page. */
router.post('/', async  function(req, res, next) {
  let formAnswer = req.body.userAnswer;
  let  data = {
    message: formAnswer,
    title: 'Buy POST',
  };

  res.render('buy.njk', data);
});

router.get('/', function(req, res) {
  res.render('buy.njk', {title: 'BUY', message: 'hello stranger'});
});

module.exports = router;
