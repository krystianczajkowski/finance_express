var express = require('express');
var router = express.Router();
var auth = require('../auth');
var db = require("../database");

const fetchUsernames = `SELECT username FROM users`;

/* GET home page. */
router.get('/', auth, function(req, res) {
  db.all(fetchUsernames, (err, rows) => {
    if (err) console.error(err.message);
    let allUsers = {};
    for (let i = 0; i < rows.length; i++) {
      const element = rows[i];
      allUsers[i] = element['username'];
      console.log(allUsers[i]);
    }
    res.render('users.njk', {title: 'Users', message: 'All users by account age:', users: allUsers, session: true});
  })
});

module.exports = router;
