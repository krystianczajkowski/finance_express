

function lookup(symbol) {
  ticker = symbol.toUpperCase();
  timeNow = Date.now();
  timeThen = new Date (timeNow - (60 * 60 * 1000));
  return [new Date(timeNow), timeThen];
}

console.log(lookup('nflx'));