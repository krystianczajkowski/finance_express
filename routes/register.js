var sqlite3 = require('sqlite3').verbose();
var express = require('express');
const session = require('express-session');
var router = express.Router();
var crypto = require('crypto');

function checkPasswordHash(hash, salt, pass) {
  return hash === crypto.pbkdf2Sync(pass, salt, 1000, 64, `sha512`).toString(`hex`);
}

const db = new sqlite3.Database('database.db');

let fetchUsernames = `SELECT username, hash, salt FROM users WHERE username = ?`;
let insertUser = `INSERT INTO users(username, hash) VALUES(?, ?)`;

/* GET home page. */
router.post('/', async function(req, res, next) {
  // sessionStorage.clear();
  let username = req.body.username;
  let password = req.body.password;
  let confirmation = req.body.confirmation;
  if (password != confirmation) {
    res.render('register.njk', message = 'Passwords must match!')
  }
  let salt = crypto.randomBytes(16).toString('hex');
  let hash = crypto.pbkdf2Sync(password, salt, 
    1000, 64, `sha512`).toString(`hex`);
  let checkedHash = checkPasswordHash(hash, salt, password);
  db.each(fetchUsernames, [username], (err, row) => {
    if (err) {
      throw err;
    }
    if (!row | checkPasswordHash())
    console.log(`Username: ${row.username}`);
  });

  let  data = {
    message: checkedHash,
    title: 'register',
  };
  
  res.render('register.njk', data);
});

router.get('/', function(req, res) {
  res.render('register.njk', {title: 'REGISTER', message: 'hello stranger'});
});

db.close();
module.exports = router;
