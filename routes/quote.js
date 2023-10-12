var express = require('express');
var router = express.Router();


function lookup(ticker) {
  let tickersymbol = ticker.toUpperCase();
  console.log(`Checking price of ${tickersymbol}\n`);
  return tickersymbol;
}


router.post('/', async function(req, res, next) {
  let ticker = req.body.symbol;
  let symbol = lookup(ticker);
  if (symbol) {
    let  data = {
      price: symbol,
      title: 'quoted POST',
    };
    return res.render('quoted.njk', data);
  }
  return res.render('quote.njk', {title: 'Failed!', message: 'Price check failed!'})
});

router.get('/', function(req, res) {
  res.render('quote.njk', {title: 'QUOTE', message: 'hello quote'});
});

module.exports = router;
