var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var db = require('../database');

function checkPasswordHash(hash, salt, pass) {
  return hash === crypto.pbkdf2Sync(pass, salt, 1000, 64, `sha512`).toString(`hex`);
}

const fetchUser = `SELECT username, hash, salt, cash FROM users WHERE username=?`;

router.post('/', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  db.get(fetchUser, [username], function(err, row) {
    if (err) {
      console.error(err.message);
    }
    else if (row) {
      if (checkPasswordHash(row.hash, row.salt, password)) {
        let data = {
          message: `Logged in as ${username}`,
          title: 'Login sucessful'
        };
        return res.render('index.njk', data);
      }
    }
    let  data = {
      message: 'Wrong password or username',
      title: 'Login failed'
    };
    return res.render('login.njk', data);
  });
});

router.get('/', function(req, res) {
  res.render('login.njk', {title: 'LOGIN', message: 'hello stranger'});
});

module.exports = router;
