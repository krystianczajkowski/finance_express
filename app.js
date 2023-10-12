var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nunjucks = require('nunjucks');
var session = require('express-session');
var sqlite3 = require('sqlite3').verbose();
var SQLiteStore = require('connect-sqlite3')(session);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var registerRouter = require('./routes/register');
var historyRouter = require('./routes/history');
var buyRouter = require('./routes/buy');
var sellRouter = require('./routes/sell');
var quoteRouter = require('./routes/quote');

const db = new sqlite3.Database(':memory:');

var app = express();

nunjucks.configure('views', {
  autoescape: true,
  express:  app
})

// view engine setup
app.set('view engine', 'nunjucks');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session( {
  store: new SQLiteStore,
  secret: 'toaster cat',
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  saveUninitialized: true,
  resave: true,
  }
));

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
