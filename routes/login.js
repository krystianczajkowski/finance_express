var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var db = require('../database');

function checkPasswordHash(hash, salt, pass) {
  return hash === crypto.pbkdf2Sync(pass, salt, 1000, 64, `sha512`).toString(`hex`);
}

const fetchUser = `SELECT username, hash, salt, cash FROM users WHERE username=?`;

router.post('/', function(req, res) {

  let username = req.body.username;
  db.get(fetchUser, [username], function(err, row) {
    if (err) {
      console.error(err.message);
    }
    else if (row) {
      if (checkPasswordHash(row.hash, row.salt, req.body.password)) {
        let data = {
          message: `Logged in as ${username}`,
          title: 'Login sucessful',
          session: true
        };
        req.session.regenerate(function (err) {
          if (err) {
            next(err);
          }
          // store user information in session, typically a user id
          req.session.user = username;
          req.session.userCash = row.cash;
          // save the session before redirection to ensure page
          // load does not happen before session is saved
          req.session.save(function (err) {
            if (err) {
              return next(err);
            }
            return res.render('index.njk', data);
          });
        });
      }
      else {
        let  data = {
          message: 'Wrong password',
          title: 'Login failed'
        };
        return res.render('login.njk', data);
      }
    }
    else {
      let  data = {
        message: 'User does not exist',
        title: 'Login failed'
      };
      return res.render('login.njk', data);
    }
  });
});

router.get('/', function(req, res) {
  res.render('login.njk', {title: 'LOGIN', message: 'Hello stranger'});
});

module.exports = router;
