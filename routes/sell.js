var express = require('express');
var router = express.Router();



/* GET home page. */
router.post('/sell', async  function(req, res, next) {
  let formAnswer = req.body.userAnswer;
  let  data = {
    message: formAnswer,
    title: 'SELL POST',
  };
  
  res.render('index.njk', data);
});

router.get('/', function(req, res) {
  res.render('sell.njk', {title: 'SELL', message: 'hello stranger'});
});

module.exports = router;
