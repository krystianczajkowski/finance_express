var express = require('express');
const auth = require('../auth');
const db = require('../database');
var router = express.Router();

const getStocks = `SELECT u.cash, up.stock, up.quantity, up.stock_value FROM user_portfolio up JOIN users u ON up.user_id = u.id WHERE u.username = ?`;

router.get('/', auth, function(req, res) {
  db.all(getStocks, [req.session.user], (err, rows) => {
    if (err) console.error(err.message);
    if (rows.length == 0) {
      let data = {
        message: 'You have no stocks',
        title: 'Index',
        balance: req.session.userCash,
        total_value: req.session.userCash,
        session: true,
      };
      
      return res.render('index.njk', data);
    }
    let total_cash = rows[0]['cash'];
    let stocks = {};
    for (let i = 0; i < rows.length; i++) {
      if (rows[i]['stock'] in stocks) {
        stocks[rows[i]['stock']]['quant'] += rows[i]['quantity'];
        stocks[rows[i]['stock']]['total_value'] = stocks[rows[i]['stock']]['quant'] * rows[i]['stock_value'];
      }
      else {
        stocks[rows[i]['stock']] = {
          name: rows[i]['stock'],
          quant: rows[i]['quantity'],
          value: rows[i]['stock_value'],
          total_value: rows[i]['quantity'] * rows[i]['stock_value']
        };
      }
    }
    for (const key in stocks) {
      if (Object.hasOwnProperty.call(stocks, key)) {
        const element = stocks[key];
        if (element['quant'] == 0 | element['total_value'] == 0) {
          delete stocks[key];
        }
        total_cash += element['total_value'];
      }
    }
    if (Object.keys(stocks).length == 0) {
      let data = {
        message: `You have no stocks`,
        title: 'Index',
        balance: rows[0]['cash'],
        total_value: total_cash,
        session: true
      };
      return res.render('index.njk', data);
    }
    let data = {
      title: 'Index',
      message: 'Your stocks',
      session: true,
      balance: rows[0]['cash'],
      total_value: total_cash,
      stocks: stocks
    };
    res.render('index.njk', data);
  });
  
});

module.exports = router;
