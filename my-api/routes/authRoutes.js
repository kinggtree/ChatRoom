var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');

const mongoose=require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.connect(process.env.EXPRESS_DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User=require("../schema/user");
var fs=require('fs');


// 注册
router.post('/signup', async function(req, res){
  try{

    // 输入验证
    if (!req.body.newUsername || !req.body.newPassword || !req.body.key) {
      return res.status(400).send("Username, password, and key are required");
    }
    if (req.body.newUsername==='' || req.body.newPassword==='' || req.body.key==='') {
      return res.status(400).send("Username, password, and key are required");
    }

    let key=fs.readFileSync('key.txt', {encoding: 'utf8'});
    if(key!==req.body.key){
      return res.status(400).send("Key wrong!");
    };
    
    let profilePicture='';
    if(req.body.gender==='female'){
      profilePicture='default_female.png'
    } else if(req.body.gender==='male') {
      profilePicture='default.png';
    } else {
      profilePicture='gun-ship.jpg';
    };

    let newUsername=req.body.newUsername;

    let existUser=await User.findOne({username: newUsername});

    if(existUser) {
      return res.status(400).send("用户名已被使用...");
    }


    let newUser=User.create({
      username: req.body.newUsername,
      password: req.body.newPassword,
      contacts: [],
      profilePictureName: profilePicture,
      self_intro: 'introduce to yourself!',
      gender: req.body.gender
    });

    if(newUser){
      return res.status(200).send("成功注册新用户");
    } else {
      return res.status(500).send("internal server error");
    }
  } catch(err){
    console.log(err);
    return res.status(500).send("internal server error");
  }

});

// 登录
router.post('/login', function(req, res) {

  if(req.body.username==='' || req.body.password===''){
    return res.status(400).send("需要填写用户名");
  }

  User.findOne({username: req.body.username})
  .then((user)=>{
    if (!user) {
      res.status(401).send("用户名错误");
    } else {
      bcrypt.compare(req.body.password, user.password, function(err, isMatch){
        if(err){
          res.status(500).send("internal server error");
        } else if(!isMatch){
          res.status(400).send('密码错误');
        } else {
          const session=req.session;
          session['username'] = user.username;
          session['_id'] = user._id;
          res.status(200).send("登录成功");
        };
      })
      
    };
  }).catch((err)=>{
    console.log(err);
    res.status(500).send("internal server error");
  })
});

// 登出
router.post('/logout', function(req, res) {
  req.session.destroy((err)=>{
    if(err){
      res.status(400).send("无法删除session!");
    } else {
      res.status(200).send("成功登出");
    }
  });
});

module.exports = router;
