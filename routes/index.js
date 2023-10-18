var express = require('express');
var router = express.Router();



/* GET home page. */
router.post('/',  function(req, res, next) {
  let formAnswer = req.body.userAnswer;
  let  data = {
    message: `Hello ${req.session.user}`,
    title: 'Index'
  };

  res.render('index.njk', data);
});

router.get('/', function(req, res) {
  res.render('index.njk', {title: 'INDEX', message: `Hello ${req.session.user}`});
});

module.exports = router;
