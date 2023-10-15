var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var db = require('../database');



let insertUser = `INSERT INTO users(username, hash, salt) VALUES(?, ?, ?)`;
// let transactions = `SELECT * FROM transactions WHERE user_id=?`;

/* GET home page. */
router.post('/', function(req, res) {
  // find a way to clear a session
  let username = req.body.username;
  let password = req.body.password;
  let confirmation = req.body.confirmation;
  if (password != confirmation) {
    return res.render('register.njk', {message: 'Passwords must match!', title: 'Registration failed'})
  }
  
  let salt = crypto.randomBytes(16).toString('hex');
  let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  
  db.run(insertUser, [username, hash, salt], function(err) {
    if (err) {
      console.error(err.message);
      return res.render('register.njk', {message: 'Username already taken!', title: 'Registration failed'});
    }
    else {
      console.log(`Row inserted with id: ${this.lastID}`);
      let  data = {
        message: `User ${username} created!`,
        title: 'Registration succesful',
      };
      res.render('login.njk', data);
    }
  });
});

router.get('/', function(req, res) {
  res.render('register.njk', {title: 'REGISTER', message: 'hello stranger'});
});

module.exports = router;
