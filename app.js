var compression = require('compression');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');

var routes = require('./routes/routes');

var app = express();
app.use(compression());
require('dotenv').config();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app/assets')));
app.use(express.static(path.join(__dirname, 'app/uploads')));
var pgp = require('pg-promise')
, session = require('express-session')
, pgSession = require('connect-pg-simple')(session);

app.use(session({
  store: new pgSession({
    conString : process.env.DATABASE_URL,
  }),
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use('/', routes);

var transport = nodemailer.createTransport({ // [1]
  service: "Gmail",
  auth: {
    user: "gmail.user@gmail.com",
    pass: "userpass"
  }
});
transport.sendMail({
  from: 'alerts@mycompany.com',
  to: 'alert@mycompany.com',
  subject: 'asa',
      text: 'as' // [4]
    });

if (process.env.NODE_ENV === 'production') { // [2]
  process.on('uncaughtException', function (er) {
    console.error(er.stack) // [3]
    transport.sendMail({
      from: 'alerts@mycompany.com',
      to: 'alert@mycompany.com',
      subject: er.message,
      text: er.stack // [4]
    }, function (er) {
     if (er) console.error(er)
       process.exit(1) // [5]
   })
  })
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.locals.title = process.env.APP_NAME;

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