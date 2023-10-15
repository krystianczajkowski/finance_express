var express = require('express');
var router = express.Router();

var auth = function isAuthenticated (req, res, next) {
    if (req.session.user) next();
    else {
        res.render('login.njk', {title: 'Login required', message: 'You must first login to view this page!'});
    }
  }

module.exports = auth;