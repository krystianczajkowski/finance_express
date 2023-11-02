var express = require('express');
var router = express.Router();
var auth = require('../auth');
var db = require('../database');

const getHistory = `SELECT up.user_id, up.stock, up.stock_value, up.quantity, up.transaction_date, up.transaction_type FROM user_portfolio up JOIN users u ON up.user_id = u.id WHERE u.username = ?`;

/* GET home page. */
router.get('/', auth, function(req, res) {
  db.all(getHistory, [req.session.user], function(err, rows) {
    if (err) console.error(err.message);
    if (rows.length == 0) {
      let data = {
        title: 'History',
        message: 'You have no history',
        session: 'true',
        transactions: null
      };
      return res.render('history.njk', data);
    }
    res.render('history.njk', { title: 'History', message: 'Your history', session: true, transactions: rows.reverse() });
  });
});

module.exports = router;
