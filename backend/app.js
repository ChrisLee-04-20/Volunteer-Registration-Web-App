var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 2023/11/27 for the auth
process.env.TOKEN_SECRET = 'secret';

const indexRouter = require('./routes/index');
const volunteerRegistrationRouter = require('./routes/volunteerRegistration');
const eventsRouter = require('./routes/events');
const volunteersRouter = require('./routes/volunteers');
const authRouter = require('./routes/auth');
const eventsManageRouter = require('./routes/eventsManage');

// for the authorization
var jwt = require('jsonwebtoken');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
passport.use(new BearerStrategy(
  function (token, done) {
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
      if (err) { return done(err); }
      return done(null, decoded, { scope: "all" });
    });
  }
));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 2023/11/07 add the new routes for the volunteers
// 2023/11/27 add the new route for the auth
// use different routes

// app.use('/', indexRouter);
// app.use('/api/v1/become/volunteer', volunteerRegistrationRouter)
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/volunteers', volunteersRouter);
app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/events/manage', eventsManageRouter);
app.use('/api/v1/events/manage', passport.authenticate('bearer', { session: false }), eventsManageRouter);

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
  res.render('error', {
    errorTitle: "Unexcepted error occur",
    errorMsg: "Please try to access the page later.",
    redirectPath: "/",
    btnName: "Home",
  });
});

module.exports = app;
