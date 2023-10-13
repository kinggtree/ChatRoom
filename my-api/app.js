var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");
var path = require('path');
const crypto=require('crypto');
const fs=require('fs');

// Express部分
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname,'/static')));

app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));

var apiRouter = require('./apiRouter');
app.use('/api', apiRouter);

app.all('*', (req, res) => {
  res.status(404).send('404-Page Not Found');
});


function generateRandomKey(length){
  return crypto.randomBytes(length).toString('hex');
}

function saveStringToFile(filename, str){
  fs.writeFileSync(filename, str, {enconding: 'utf8'});
}

let currentString=generateRandomKey(8);
saveStringToFile('key.txt', currentString);

// 计算到下一个整点的毫秒数
function msToNextHour(){
  const now=new Date();
  const nextHour=new Date(now);
  nextHour.setHours(now.getHours() + 1);
  nextHour.setMinutes(0);
  nextHour.setSeconds(0);
  nextHour.setMilliseconds(0);
  return nextHour - now;
}

setTimeout(()=>{
  currentString=generateRandomKey(8);
  saveStringToFile('key.txt', currentString);

  // 设置每小时更新字符串
  setInterval(()=>{
    currentString=generateRandomKey(8);
    saveStringToFile('key.txt', currentString);
  }, 1000*60*60);   // 1000毫秒*60秒*60分钟 = 1小时
}, msToNextHour());


module.exports = app;
