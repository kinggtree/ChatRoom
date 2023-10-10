var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");

// Express部分
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));

var apiRouter = require('./apiRouter');
app.use('/api', apiRouter);


module.exports = app;
