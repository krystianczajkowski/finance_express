var express = require("express");
var router = express.Router();
var auth = require("../auth");
var db = require("../database");
var crypto = require("crypto");

var fetchUserData = `SELECT * FROM users WHERE username=?`;
var setCash = `UPDATE users SET cash=? WHERE username=?`;
var logTransaction = `INSERT INTO transactions(user_id, stock_value, stock, quantity, transaction_type) VALUES(?, ?, ?, ?, ?)`;


router.post("/", auth, function (req, res, next) {
    db.get(fetchUserData, [req.session.user], function (err, row) {
        if (err) console.error(err.message);
        let ticker = req.body.ticker.toUpperCase();
        let quantity = req.body.quantity;
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
                return parseFloat(json.reverse()[0]["Adj Close"]) * quantity;
            })
            .then((price) => {
                if (price > userCash) {
                    return res.render("buy.njk", {
                        message: "Not enough cash",
                    });
                }
                db.serialize(function() {
                    db.run(logTransaction, [row.id, price, ticker, quantity], function(err) {
                        if (err) console.error(err.message);
                    });
                    userCash -= price;
                    req.session.userCash = userCash;
                    db.run(setCash, [userCash, req.session.user], (err) => {
                        if (err) console.error(err.message);
                    });
                });
                let data = {
                    balance: userCash,
                    message: `Succesfully bought ${quantity} shares of ${ticker} at $${price}`
            };
                return res.render("buy.njk", data);
            })
            .catch((Error) => {
                console.error(Error.message);
                return res.render("buy.njk", { message: "No such stock!" });
            });
    });
    // db.close();
});

router.get("/", auth, function (req, res) {
    if (req.session.userCash) {
        let data = {
            title: 'Buy',
            message: 'Purchase a stock',
            balance: `${req.session.userCash}`
        };
        return res.render("buy.njk", data);
    }
    res.render("buy.njk", { title: "BUY", message: "Buy stock" });
});

module.exports = router;
