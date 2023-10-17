var express = require("express");
var router = express.Router();
var auth = require("../auth");

/* GET home page. */
router.post("/sell", auth, async function (req, res, next) {
    let data = {
        message: "Sold ",
        title: "SELL",
    };

    res.render("index.njk", data);
});

router.get("/", auth, function (req, res) {
    res.render("sell.njk", { title: "SELL", message: "Sell stock" });
});

module.exports = router;
