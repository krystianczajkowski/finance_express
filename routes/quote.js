var express = require('express');
var router = express.Router();
var auth = require('../auth');

function lookup(symbol, res) {
  let ticker = symbol.toUpperCase();
  let timeNow = parseInt(Date.now()/1000);
  let timeThen = parseInt(timeNow - (60 * 60 * 1000));
  let url = `https://query1.finance.yahoo.com/v7/finance/download/${ticker}`+
            `?period1=${timeThen}` +
            `&period2=${timeNow}` +
            `&interval=1d&events=history&includeAdjustedClose=true`;
  
  const params = {
    cookies: {
      'session': crypto.randomUUID(),
    },
    headers: {
      'User-Agent': 'javascript-requests',
      'Accept': '*/*',
      
    }
  };
  
  let r = new Request(url, params);
  fetch(r)
    .then((response) => {
      if (!response.ok) {
        throw new Error;
      }
      return response.text();
    }).then((response) => {
      let titles = response.slice(0, response.indexOf('\n')).split(',');
      let json = response.slice(response.indexOf('\n') + 1).split('\n').map(
        fn => {
          const values = fn.split(',');
          return titles.reduce(
            (obj, title, index) => ((obj[title] = values[index]), obj), {});
        });
      let price = json.reverse()[0]['Adj Close'];
      const deets = {
        "name": ticker,
        "price": parseFloat(price).toFixed(2),
        "symbol": ticker
      };
      console.log(deets);
      return res.render('quoted.njk', deets);
  }).catch((Error) => {
    console.error(Error.message);
    return res.render('quote.njk', {message:'Wrong ticker'});
  });
}

router.post('/', auth, function(req, res) {
  lookup(req.body.symbol, res);
});

router.get('/', auth, function(req, res) {
    res.render('quote.njk', {title: 'Quote', message: 'Check price:'});
});

module.exports = router;
