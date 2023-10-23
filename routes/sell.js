var express = require("express");
var router = express.Router();
var auth = require("../auth");
var db = require("../database");

var fetchUserData = `SELECT * FROM users WHERE username=?`;
var setCash = `UPDATE users SET cash=? WHERE username=?`;
var logTransaction = `INSERT INTO transactions(user_id, stock_value, stock, quantity, transaction_type) VALUES(?, ?, ?, ?, ?)`;
var getUserStock = `SELECT `;

router.post("/sell", auth, function (req, res, next) {
    db.get(fetchUserData, [req.session.user], function(err, row) {
        if (err) console.error(err.message);
    });
    res.render("sell.njk", data);
});

router.get("/", auth, function (req, res) {
    // count how many stocks a user has
    db.get(fetchUserData, [req.session.user], function(err, rows) {
        if (err) console.error(err.message);
        
    });
    res.render("sell.njk", { title: "SELL", message: "Sell stock" });
});

module.exports = router;
