var express = require('express');
const auth = require('../auth');
const db = require('../database');
var router = express.Router();



/* GET home page. */
router.post('/', auth, function(req, res, next) {
  let formAnswer = req.body.userAnswer;
  let  data = {
    message: `Hello ${req.session.user}`,
    title: 'Index'
  };

  res.render('index.njk', data);
});

router.get('/', auth, function(req, res) {
  if (req.session.user) {
    db.all("SELECT username FROM users", function(err, rows) {
      if (err) console.error(err.message);
      let data = {
        message: `Hello ${req.session.user}`,
        title: 'Index',
      };
      // for (let i = 0; i < rows.length; i++) {
      //   data['users'][i] = rows[i]['username'];
      //   console.log(data['users']);
      // }
      res.render('index.njk', data);
    });
    return 0;
  }
  return res.render('index.njk', {message: 'Hello stranger'})
});

module.exports = router;
