var express = require('express');
const session = require('express-session');
var router = express.Router();
var crypto = require('crypto');
var db = require('../database');

function checkPasswordHash(hash, salt, pass) {
  return hash === crypto.pbkdf2Sync(pass, salt, 1000, 64, `sha512`).toString(`hex`);
}

let fetchUsernames = `SELECT username, hash, salt FROM users WHERE username = ?`;
let insertUser = `INSERT INTO users(username, hash) VALUES(?, ?)`;
let transactions = `SELECT * FROM transactions WHERE user_id=?`;

/* GET home page. */
router.post('/', async function(req, res, next) {
  // sessionStorage.clear();
  let username = req.body.username;
  let password = req.body.password;
  let confirmation = req.body.confirmation;
  if (password != confirmation) {
    return res.render('register.njk', {message: 'Passwords must match!', title: 'registration failed'})
  }
  // let salt = crypto.randomBytes(16).toString('hex');
  // let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  
  db.get(transactions, [1], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`row: ${row.stock}`);
    return row;
  });

  let  data = {
    message: 'User created!',
    title: 'Registration succesful',
  };
  res.render('login.njk', data);
});

router.get('/', function(req, res) {
  res.render('register.njk', {title: 'REGISTER', message: 'hello stranger'});
});

module.exports = router;
