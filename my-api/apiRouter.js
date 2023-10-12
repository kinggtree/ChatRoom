var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var fs=require('fs');

const mongoose=require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://127.0.0.1/ChatRoom", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User=require("./schema/user");
const Message=require("./schema/message");

// 注册
router.post('/signup', function(req, res){

  let profilePicture='';
  if(req.body.gender==='female'){
    profilePicture='default_female.png'
  } else if(req.body.gender==='male') {
    profilePicture='default.png';
  } else {
    profilePicture='gun-ship.jpg';
  }

  newUsername=req.body.newUsername;

  User.findOne({username: newUsername})
    .then(existUser=>{
      if(existUser) {
        res.status(400).send("user already exists...");
        return;
      }

      return User.create({
        username: req.body.newUsername,
        password: req.body.newPassword,
        contacts: [],
        profilePictureName: profilePicture,
        self_intro: 'introduce to yourself!',
        gender: req.body.gender
      })
    }).then((newUser)=>{
    if(newUser)
    {
      res.status(200).send("successfully register user.");
    }
  }).catch(err=>{
    res.status(500).send("register error: ", err.toString());
  });
});

// 登录
router.post('/login', function(req, res) {
  User.findOne({username: req.body.username})
  .then((user)=>{
    if (!user) {
      res.status(401).send("username wrong!");
    } else {
      bcrypt.compare(req.body.password, user.password, function(err, isMatch){
        if(err){
          res.status(500).send("authentication error!");
        } else if(!isMatch){
          res.status(400).send('password wrong!');
        } else {
          const session=req.session;
          session['username'] = user.username;
          session['_id'] = user._id;
          res.status(200).send("login success!");
        };
      })
      
    };
  }).catch((err)=>{
    console.log(err);
    res.status(500).send("err in ", err.toString());
  })
});

// 添加新好友
router.post('/newFriend', async function(req, res) {
  try {
    if(req.body.friendName === req.session.username) {
      return res.status(401).send("Cannot add yourself...");
    };

    // 找到对方的user信息
    const user = await User.findOne({username: req.body.friendName});

    if(!user || user.contactUsername === '') {
      return res.status(401).send("No such person.");
    };

    // 避免重复添加
    const existingContact=await User.findOne({_id: req.session._id});
    
    if(existingContact.length){
      return res.status(401).send("You have already added!");
    }
    
    const newFriend = {
      contactUsername: user.username,
      contactId: user._id,
    };

    const selfInfo={
      contactUsername: req.session.username,
      contactId: req.session._id
    };
    
    // 将对方的User信息添加到自己的联系人中
    await User.findOneAndUpdate(
      {username: req.session.username},
      {$push: {contacts: newFriend}},
      {new: true, useFindAndModify: false}
    );

    // 将自己的信息添加到对方的通讯录中
    await User.findOneAndUpdate(
      {username: newFriend.contactUsername},
      {$push: {contacts: selfInfo}},
      {new: true, useFindAndModify: false}
    );
    
    res.status(200).send("new friend add finished.");
    
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred: ", err.toString());
  };
});


// 获取用户信息
router.post('/getUserInfo', function(req, res) {
  if(!req.session._id)
    return res.status(401).send();
  User.findOne({_id: req.session._id})
    .then((response)=>{
      res.status(200).send({
        'username': req.session.username,
        'contacts': response.contacts,
        '_id': req.session._id
      });
    }).catch((err)=>{
      console.log(err);
      res.status(400).send(err.toString());
    })
});

// 登出
router.post('/logout', function(req, res) {
  req.session.destroy((err)=>{
    if(err){
      res.status(400).send("Delete session error!");
    } else {
      res.status(200).send("Log out success!");
    }
  });
});

//获取指定用户头像-图片URL发送方法
router.post('/profilePictureURL', function(req, res){
  if(!req.session._id)
    return res.status(401).send("No session!");

  try{
    res.set('Cache-Control', 'no-store');
    User.findOne({_id: req.body.contactId})
      .then((response)=>{
        const picName=response.profilePictureName;
        res.status(200).send("http://localhost:5000/static/profile_photos/"+picName);

      }).catch((err)=>{
        res.status(500).send("internal server error!");
        console.log(err);
      });
  } catch(err) {
    res.status(500).send("internal server error!");
    console.log(err);
  }
});

// 获取用户个人档案
router.post('/personalProfile', function(req, res) {
  if(!req.session._id)
    return res.status(401).send();
  User.findOne({_id: req.session._id})
    .then((response)=>{
      res.status(200).send({
        'username': req.session.username,
        'profilePictureURL': "http://localhost:5000/static/profile_photos/"+response.profilePictureName,
        'self_intro': response.self_intro,
        'gender': response.gender,
        'contacts': response.contacts
      });
    }).catch((err)=>{
      console.log(err);
      res.status(400).send(err.toString());
    })
});

router.post('/unfriend',function(req, res){
  if(!req.session._id)
    return res.status(401).send();
  User.findOneAndUpdate(
    {_id: req.session._id},
    {$pull: {contacts: req.body}},
    {new: true, useFindAndModify: false}
  ).then(()=>{
    res.status(200).send("finish deleteing");
  }).catch((err)=>{
    console.log(err);
    res.status(500).send("internal server error");
  })
})


module.exports = router;
