const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');

try {
  fs.mkdirSync(path.join(__dirname, '..', 'uploads'));
} catch(_) {}

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/i', express.static(path.join(__dirname, 'uploads')));
app.use(fileUpload({ preserveExtension: true, safeFileNames: true }));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
