

function lookup(symbol) {
  let ticker = symbol.toUpperCase();
  let timeNow = parseInt(Date.now()/1000);
  let timeThen = parseInt(timeNow - (60 * 60 * 1000));
  let url = `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${timeThen}&period2=${timeNow}&interval=1d&events=history&includeAdjustedClose=true`;
  
  return [timeNow, timeThen, url];
}

console.log(lookup('nflx'));