var express = require('express');
const auth = require('../auth');
const db = require('../database');
var router = express.Router();



/* GET home page. */
router.post('/', auth, function(req, res, next) {
  let formAnswer = req.body.userAnswer;
  let  data = {
    message: `Hello ${req.session.user}`,
    title: 'Index',
    session: true
  };

  res.render('index.njk', data);
});

router.get('/', auth, function(req, res) {
  if (req.session.user) {
    let data = {
      message: `Hello ${req.session.user}`,
      title: 'Index',
      session: true
    };
    res.render('index.njk', data);
  }
  
});

module.exports = router;
