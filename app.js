var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var nunjucks = require('nunjucks');
var session = require('express-session');
var LokiStrore = require('connect-loki')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var registerRouter = require('./routes/register');
var historyRouter = require('./routes/history');
var buyRouter = require('./routes/buy');
var sellRouter = require('./routes/sell');
var quoteRouter = require('./routes/quote');



var app = express();

var env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

env.addFilter('usd', function(price){
    // returns price in dollars
    return `$${parseFloat(price).toFixed(2)}`;
  });

// view engine setup
app.set('view engine', 'nunjucks');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new LokiStrore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));


app.use('/', indexRouter);
app.use('/quote', quoteRouter);
app.use('/buy', buyRouter);
app.use('/sell', sellRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/history', historyRouter);
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
