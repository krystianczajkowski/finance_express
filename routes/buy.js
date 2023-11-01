var express = require("express");
var router = express.Router();
var auth = require("../auth");
var db = require("../database");
var crypto = require("crypto");

var fetchUserData = `SELECT * FROM users WHERE username=?`;
var setCash = `UPDATE users SET cash=? WHERE username=?`;
var addStock = `INSERT INTO user_portfolio(user_id, stock_value, stock, quantity, transaction_type) VALUES(?, ?, ?, ?, ?)`;


router.post("/", auth, function (req, res, next) {
    let quantity = req.body.quantity;
    let ticker = req.body.ticker.toUpperCase();
    if (quantity <= 0 | ticker == '') {
        return res.render('buy.njk', {message: 'Select a stock to buy', session: true});
    }
    db.get(fetchUserData, [req.session.user], function (err, row) {
        if (err) console.error(err.message);
        let userCash = row.cash;
        let timeNow = parseInt(Date.now() / 1000);
        let timeThen = timeNow - (1000 * 60 * 60);
        let url =
            `https://query1.finance.yahoo.com/v7/finance/download/${ticker}` +
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
                if (price*quantity > userCash) {
                    return res.render("buy.njk", {
                        message: "Not enough cash",
                        session: true
                    });
                }
                db.serialize(function() {
                    db.run(addStock, [row.id, price, ticker, quantity, 'BUY'], function(err) {
                        if (err) console.error(err.message);
                    });
                    userCash -= price * quantity;
                    db.run(setCash, [userCash, req.session.user], (err) => {
                        if (err) console.error(err.message);
                        req.session.userCash = userCash;
                        let data = {
                            balance: userCash,
                            message: `Succesfully bought ${quantity} shares of ${ticker} at $${price} for ${price * quantity}`,
                            session: true,
                            balance: req.session.userCash
                        };
                        return res.render("buy.njk", data);
                    });
                });
            })
            .catch((Error) => {
                console.error(Error.message);
                return res.render("buy.njk", { message: "No such stock!", balance: req.session.userCash });
            });
    });
});

router.get("/", auth, function (req, res) {
    if (req.session.userCash) {
        let data = {
            title: 'Buy',
            message: 'Purchase a stock',
            balance: req.session.userCash,
            session: true
        };
        return res.render("buy.njk", data);
    }
    res.render("buy.njk", { title: "BUY", message: "Buy stock", session: true });
});

module.exports = router;
