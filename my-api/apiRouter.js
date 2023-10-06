var express = require('express');
var router = express.Router();

const mongoose=require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://127.0.0.1/ChatRoom", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const User=require("./schema/user");

// 登录
router.post('/login', function(req, res) {
  User.findOne({username: req.body.username})
  .then((user, err)=>{
    if(err){
      res.status(500).send("database query wrong!");
    } else if (!user) {
      res.status(401).send("username wrong!");
    } else {
      if(req.body.password===user.password) {
        const session=req.session;
        session['username'] = user.username;
        session['contacts'] = user.contacts;
        session['_id'] = user._id;
        res.status(200).send("login success!");
      } else {
        res.status(400).send("password wrong!");
      }
    };
  }).catch((err)=>{
    console.log(err);
    res.status(500).send("err in ", err);
  })
});




// 获取用户信息
router.get('/getUserInfo', function(req, res) {
  res.status(200).send({
    'username': req.session.username,
    'contacts': req.session.contacts
  });
});

// 登出
router.post('/logout', function(req, res) {
  req.session.destroy((err)=>{
    if(err){
      res.status(400).send("Delete session error!");
    } else {
      res.status(200).send("Log Out success!");
    }
  });
});


module.exports = router;
