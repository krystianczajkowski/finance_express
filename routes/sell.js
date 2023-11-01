var express = require("express");
var router = express.Router();
var auth = require("../auth");
var db = require("../database");

var fetchUserData = `SELECT u.id as uid, u.cash as ucash, u_p.stock, u_p.quantity as quant FROM users u, user_portfolio u_p WHERE u.username=? AND u.id = u_p.user_id;`;
var setCash = `UPDATE users SET cash=? WHERE username=?`;
var addStock = `INSERT INTO user_portfolio(user_id, stock_value, stock, quantity, transaction_type) VALUES(?, ?, ?, ?, ?)`;

router.post("/", auth, function (req, res, next) {
    let stock = req.body.stock;
    let quant = req.body.quantity;
    if (quant > req.session.stocks[stock]) {
        console.log('negative stocks');
        let data = {
            title: 'Not enough stocks!',
            message: `Can't sell ${quant} ${stock} you only have ${req.session.stocks[stock]}`,
            session: true,
            user_stocks: req.session.stocks,
            cash: req.session.userCash,
        }
        return res.render("sell.njk", data);
    }
    let timeNow = parseInt(Date.now() / 1000);
    let timeThen = timeNow - (1000 * 60 * 60);
    let url =
        `https://query1.finance.yahoo.com/v7/finance/download/${stock}` +
        `?period1=${timeThen}` +
        `&period2=${timeNow}` +
        `&interval=1d&events=history&includeAdjustedClose=true`;
    const params = {
        cookies: {
            session: crypto.randomUUID(),
        },
        headers: {
            "User-Agent": "javascript-requests",
            Accept: "*/*",
        },
    };
    fetch(new Request(url, params))
        .then((response) => {
            if (!response.ok) {
                throw new Error();
            }
            return response.text();
        })
        .then((response) => {
            let titles = response
                .slice(0, response.indexOf("\n"))
                .split(",");
            let json = response
                .slice(response.indexOf("\n") + 1)
                .split("\n")
                .map((fn) => {
                    const values = fn.split(",");
                    return titles.reduce(
                        (obj, title, index) => (
                            (obj[title] = values[index]), obj
                        ),
                        {}
                    );
                });
            return parseFloat(json.reverse()[0]["Adj Close"]);
        })
        .then((price) => {
            db.serialize(function() {
                let userCash = req.session.userCash;
                userCash += price * quant;
                let data = {
                    message: `Sold ${quant} of ${stock} for $${price * quant}`,
                    session: true
                };
                quant *= -1;
                req.session.userCash = userCash;
                db.run(setCash, [userCash, req.session.user], (err) => {
                    if (err) console.error(err.message);
                });
                db.run(addStock, [req.session.user_id, price, stock, quant, 'SELL'], function(err) {
                    if (err) console.error(err.message);
                });
                res.render("index.njk", data);
            });
        })
        .catch((Error) => {
            console.error(Error.message);
            return res.render("sell.njk", { message: "Something went wrong!", session: true});
        });
});

router.get("/", auth, function (req, res) {
    // count how many stocks a user has
    db.all(fetchUserData, [req.session.user], function(err, rows) {
        if (err) console.error(err.message);
        let user_stocks = {};
        let count = 0;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i]['stock'] in user_stocks) {
                user_stocks[rows[i]['stock']] += rows[i]['quant'];
            }
            else {
                user_stocks[rows[i]['stock']] = rows[i]['quant'];
                count++;
            }
        }
        for (const key in user_stocks) {
            if (Object.hasOwnProperty.call(user_stocks, key)) {
                const element = user_stocks[key];
                if (element == 0) {
                    console.log(`Deleted ${key}`);
                    count--;
                    delete user_stocks[key];
                }
            }
        }
        if (count == 0) return res.render('buy.njk', {cash: req.session.userCash, title: 'Buy something!', session: true, message: 'In order to sell stock, first you need to have some!'});
        req.session.userCash = rows[0]['ucash'];
        req.session.user_id = rows[0]['uid'];
        req.session.stocks = user_stocks;
        res.render("sell.njk", { cash: req.session.userCash, title: "SELL", message: "Sell stock", user_stocks: req.session.stocks, session: true});
    });
});

module.exports = router;
