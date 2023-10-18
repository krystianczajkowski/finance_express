var express = require("express");
var router = express.Router();
var auth = require("../auth");
var db = require("../database");

var fetchUserData = `SELECT * FROM users WHERE username=?`;
var buyStock = `UPDATE users(cash) VALUES cash=? WHERE username=?`;

router.post("/", auth, function (req, res, next) {
    db.get(fetchUserData, [req.session.user], function (err, row) {
        if (err) {
            console.error(err.message);
        }
        let ticker = req.body.ticker.toUpperCase();
        let quantity = req.body.quantity;
        timeNow = parseInt(Date.now() / 1000);
        let url =
            `https://query1.finance.yahoo.com/v7/finance/download/${ticker}` +
            `?period1=${timeNow}` +
            `&period2=${timeNow}` +
            `&interval=1d&events=history&includeAdjustedClose=true`;
        console.log(url);
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
                userCash -= price;
                return res.render("buy.njk", { message: price });
            })
            .catch((Error) => {
                console.error(Error.message);
                return res.render("buy.njk", { message: "No such stock!" });
            });
    });
    // db.run(buyStock, [req.session.user, row.cash], function(err){
    //     if (err) console.error(err.message);
    // });
    // db.close();
});

router.get("/", auth, function (req, res) {
    res.render("buy.njk", { title: "BUY", message: "Buy stock" });
});

module.exports = router;
