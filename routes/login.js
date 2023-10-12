var express = require('express');
var router = express.Router();



/* GET home page. */
router.post('/login', async function(req, res, next) {
  let formAnswer = req.body.userAnswer;
  let  data = {
    message: formAnswer,
    title: 'Login',
  };

  res.render('login.njk', data);
});

router.get('/', function(req, res) {
  res.render('index.njk', {title: 'LOGIN', message: 'hello stranger'});
});

module.exports = router;
