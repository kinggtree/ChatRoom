var express = require('express');
var router = express.Router();

require('dotenv').config();


const mongoose=require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.connect(process.env.EXPRESS_DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User=require("../schema/user");


// 添加新好友
router.post('/newFriend', async function(req, res) {
  try {
    if(req.body.friendName === req.session.username) {
      return res.status(401).send("无法添加你自己");
    };

    // 找到对方的user信息
    const user = await User.findOne({username: req.body.friendName});

    if(!user || user.username === '') {
      return res.status(401).send("查无此人");
    };

    // 避免重复添加
    const existingContact=await User.findOne(
      {_id: req.session._id},
      {contacts: {$elemMatch: {contactId: user._id} } } );
    
    if(existingContact.contacts.length){
      return res.status(401).send("你已经添加过此人了");
    }
    
    const newFriend = {
      contactId: user._id,
    };

    const selfInfo={
      contactId: req.session._id
    };
    
    // 将对方的User信息添加到自己的联系人中
    await User.findOneAndUpdate(
      {_id: req.session._id},
      {$push: {contacts: newFriend}},
      {new: true, useFindAndModify: false}
    );

    // 将自己的信息添加到对方的通讯录中
    await User.findOneAndUpdate(
      {_id: newFriend.contactId},
      {$push: {contacts: selfInfo}},
      {new: true, useFindAndModify: false}
    );
    
    res.status(200).send("成功添加");
    
  } catch (err) {
    console.log(err);
    res.status(500).send('internal server error');
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
    });
});




// 获取用户个人档案
router.post('/personalProfile', function(req, res) {
  if(!req.session._id)
    return res.status(401).send();
  User.findOne({_id: req.session._id})
    .then((response)=>{
      const URLPath=process.env.EXPRESS_API_BASE_URL+"/static/profile_photos/";
      res.status(200).send({
        'username': req.session.username,
        'profilePictureURL': URLPath+response.profilePictureName,
        'self_intro': response.self_intro,
        'gender': response.gender,
        'contacts': response.contacts,
        'like': response.like
      });
    }).catch((err)=>{
      console.log(err);
      res.status(400).send("internal server error!");
    });
});

// 删除好友
router.post('/unfriend',async function(req, res){
  if(!req.session._id)
    return res.status(401).send();

  try{
    // 删除我方的这个好友
    await User.findOneAndUpdate(
      {_id: req.session._id},
      {$pull: {contacts: {contactId: req.body.friendId}}},      // 10.17 16:29 修改了这里
      {new: true, useFindAndModify: false}
    ).catch((err)=>{
      console.log(err);
    });

    // 从对方联系人列表中删除自己
    await User.findOneAndUpdate(
      {_id: req.body.friendId},
      {$pull: {contacts: {contactId: req.session._id} } },
      {new: true, useFindAndModify: false}
    ).catch((err)=>{
      console.log(err);
    });

    res.status(200).send("成功删除");
  } catch(err){
    console.log(err);
    res.status(500).send("internal server error");
  };

});


// 改变个人信息
router.post('/changeIntro', function(req, res){
  if(!req.session._id)
    return res.status(401).send();

  let newGender='';
  let newUsername='';
  let newIntro='';

  // 如果性别都为空的话则设置原来的值
  if(req.body.gender==='')
    newGender=req.session.gender;
  else
    newGender=req.body.gender;

  // 姓名为空设置默认
  if(req.body.newUsername==='')
    newUsername=req.session.username;
  else
    newUsername=req.body.newUsername;

  // 个人介绍为空的设置见前端


  let Intro='';
  if(!req.body.newIntro)
    Intro=req.session.self_intro;
  else
    Intro=req.body.newIntro;

  User.findOneAndUpdate(
    {_id: req.session._id},
    {$set: {username: newUsername, self_intro: Intro, gender: newGender}},
    {new: false, useFindAndModify: true}
  ).then(()=>{
    res.status(200).send("修改成功");
  }).catch((err)=>{
    console.log(err);
    res.status(500).send("internal server error");
  });
});


// 更改密码
router.post('/changePassword', function(req, res){
  if(!req.session._id)
    return res.status(401).send();

  User.findOne({_id: req.session._id})
    .then((user)=>{
      if (!user) {
        res.status(500).send("internal server error");
      } else {
        bcrypt.compare(req.body.originalPassword, user.password, function(err, isMatch){
          if(err){        // 对比器错误
            res.status(500).send("internal server error");
          } else if(!isMatch){    // 旧密码不匹配
            res.status(400).send('原密码错误');
          } else {      // 修改密码
            User.findOneAndUpdate(
              {_id: req.session._id},
              {$set: {password: req.body.newPassword}},
              {new: false, useFindAndModify: true}
            ).then(()=>{
              res.status(200).send("成功修改密码");
            }).catch((err)=>{
              console.log(err);
              res.status(500).send("internal server error");
            });
          };
        })
        
      };
    }).catch((err)=>{
      console.log(err);
      res.status(500).send("internal server error");
    })
})

// 获得朋友档案
router.post('/getFriendInfo', function(req, res){
  if(!req.session._id)
    return res.status(401).send();

  const URLPath=process.env.EXPRESS_API_BASE_URL+"/static/profile_photos/";
  
  let resData={
    _id: '',
    username: '',
    self_intro: '',
    gender: '',
    profilePictureURL: '',
    like: 0
  }

  User.findOne({_id: req.body.friendId})
    .then((response)=>{
      resData._id=response._id.toString();
      resData.username=response.username;
      resData.self_intro=response.self_intro;
      resData.gender=response.gender;
      resData.profilePictureURL=URLPath+response.profilePictureName;
      resData.like=response.like;
      res.status(200).send(resData);
    }).catch((err)=>{
      console.log(err);
      res.status(500).send("internal server error!");
    });
});


// 管理联系人中仅获取联系人姓名
router.post('/getFriendName', function(req, res){
  if(!req.session._id)
    return res.status(401).send();

  User.findOne({_id: req.body.friendId})
    .then((response)=>{
      res.status(200).send(response.username);
    }).catch((err)=>{
      console.log(err);
      res.status(500).send("internal server error!");
    });
});

module.exports = router;
