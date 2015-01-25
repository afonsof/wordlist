var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

var config_passport = require('./config/passport');
var config_errors = require('./config/errors');
var config_engine = require('./config/engine');

var routes = require('./api/routes/index');
var users = require('./api/routes/users');
var db = require('./config/db');

var app = express();
config_engine(app);

app.use(favicon(__dirname + '/app/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));

app.use('/', routes);
app.use('/users', users);

config_passport(app, db);
config_errors(app);

module.exports = app;