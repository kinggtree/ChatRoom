var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const mongoose=require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://127.0.0.1/ChatRoom", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const User=require("./schema/user");
const Message=require("./schema/message");

// 注册
router.post('/signup', function(req, res){

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
        contacts:[]
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


router.post('/newFriend', async function(req, res) {
  try {
    if(req.body.friendName === req.session.username) {
      return res.status(401).send("cannot add yourself...");
    }
    
    // 找到对方的user信息
    const user = await User.findOne({username: req.body.friendName});
    
    if(!user || user.contactUsername === '') {
      return res.status(401).send("No such person.");
    }
    
    const newFriend = {
      contactUsername: user.username,
      contactId: user._id
    };

    const selfInfo={
      contactUsername: req.session.username,
      contactId: req.session._id
    }
    
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
  }
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

// 由websocket代替
router.post('/sendMessage', function(req,res) {
  if(!req.session._id)
    return res.status(401).send("No session!");

  try {
    Message.create({
      sender: {
        senderName: req.body.sender.senderName,
        senderId: new mongoose.Types.ObjectId(req.body.sender.senderId)
      },
      receiver:{
        receiverName: req.body.receiver.receiverName,
        receiverId: new mongoose.Types.ObjectId(req.body.receiver.receiverId)
      },
      message: {
        messageType: req.body.message.type,
        messageContent: req.body.message.content
      },
      date: new Date()
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error!");
  }
  
  res.status(200).send();
});


module.exports = router;
