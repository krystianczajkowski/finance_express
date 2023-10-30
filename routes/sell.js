var express = require("express");
var router = express.Router();
var auth = require("../auth");
var db = require("../database");

var fetchUserData = `SELECT u.id, u.cash, u_p.stock, u_p.quantity as quant FROM users u, user_portfolio u_p WHERE u.username=? AND u.id = u_p.user_id;`;
var setCash = `UPDATE users SET cash=? WHERE username=?`;
var addStock = `INSERT INTO user_portfolio(user_id, stock_value, stock, quantity, transaction_type) VALUES(?, ?, ?, ?, 'SELL')`;

router.post("/", auth, function (req, res, next) {
    let stock = req.body.stock;
    let quant = req.body.quantity;
    if (quant > req.session.stocks[stock]) {
        console.log('negative stocks');
        let data = {
            title: 'Not enough stocks!',
            message: `Can't sell ${quant} ${stock} you only have ${req.session.stocks[stock]}`,
            session: true,
            user_stocks: req.session.stocks
        }
        return res.render("sell.njk", data);
    }
    // db.get(fetchUserData, [req.session.user], function(err, row) {
    //     if (err) console.error(err.message);
    // });
    let data = {
        title: quant,
        message: `${quant} is smaller than ${req.session.stocks[stock]}`,
    }
    res.render("sell.njk", data);
});

router.get("/", auth, function (req, res) {
    // count how many stocks a user has
    db.all(fetchUserData, [req.session.user], function(err, rows) {
        if (err) console.error(err.message);
        let user_stocks = {};
        for (let i = 0; i < rows.length; i++) {
            if (rows[i]['stock'] in user_stocks) {
                user_stocks[rows[i]['stock']] += rows[i]['quant'];
            }
            else user_stocks[rows[i]['stock']] = rows[i]['quant'];
        }
        req.session.stocks = user_stocks;
        console.log(req.session.stocks);
        res.render("sell.njk", { title: "SELL", message: "Sell stock", user_stocks, session: true});
    });
});

module.exports = router;
