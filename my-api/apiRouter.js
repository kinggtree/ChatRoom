var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var fs=require('fs');
require('dotenv').config();


const mongoose=require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.connect(process.env.EXPRESS_DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User=require("./schema/user");
const Message=require('./schema/message');

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
router.post('/getFriendBoxInfo', function(req, res){
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

// 获取是否有未读信息
router.post('/getUnread', function(req, res){
  if(!req.session._id)
    return res.status(401).send();

  Message.find({'sender.senderId': req.body.senderId, 'receiver.receiverId': req.body.receiverId}     //sender和receiver交换的工作在前端做完了
  ).sort({ createdAt: -1 })  // 按照createdAt字段降序排序
  .limit(1)  // 只获取最新的10条记录
  .exec()
  .then(docs => {
    if(docs.length===0){
      res.status(200).send({unread: undefined});
    } else {
      res.status(200).send({unread: docs[0].unread});
    }
  })
  .catch(err => {
    res.status(500).send("internal server error");
    console.error(err);
  });
});

// 设置单条消息已读
router.post('/setIsRead', function(req, res){
  if(!req.session._id)
    return res.status(401).send();

  if(!Array.isArray(req.body.messageIds)) {
    return res.status(400).send('messageIds should be an array');
  }

  Message.updateMany(
    {_id: {$in: req.body.messageIds}},
    {$set: {unread: false}},
    )
    .then(()=>{
      res.status(200).send('修改成功');
    }).catch((err)=>{
      console.log(err);
      res.status(500).send('internal server error');
    });
});

// 实现点赞功能
router.post('/like', function(req, res){
  if(!req.session._id)
    return res.status(401).send();

  User.findOneAndUpdate(
    {_id: req.body._id},
    {$inc: {like: 1}},
    {new: true, useFindAndModify: false}
    )
    .then((response)=>{
      res.status(200).send(String(response.like));
    }).catch((err)=>{
      console.log(err);
      res.status(500).send('internal server error');
    })
});


// 由服务器主动发送未读提示
router.get('/serverSendNew', async function(req, res) {
  if (!req.session._id) {
    return res.status(401).send('Unauthorized');
  }

  // 设置SSE相关的头部信息
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const userId = req.session._id;

  try {
    // 获取初始化的所有未读消息数量
    const unreadMessages = await Message.find({
      'receiver.receiverId': userId,
      unread: true
    });

    // 发送初始化数据到前端
    for (const msg of unreadMessages) {
      console.log("senderId: "+msg.sender.senderId.toString());     // 要发送的未读消息到前端
      res.write(`data: ${JSON.stringify({ 
        senderId: msg.sender.senderId
      })}\n\n`);
    }

    // 使用$match来过滤变更
    const pipeline = [
      {
        $match: {
          "fullDocument.sender.senderId": userId        // 监听自己发送出去的消息
        }
      }
    ];

    const changeStream = Message.watch(pipeline);

    changeStream.on('change', (change) => {
      if (change.operationType === 'insert') {
        const newMessage = change.fullDocument;
        console.log(newMessage);      // 理论上来说现在监听的是自己发送出去的消息
        res.write(`data: ${JSON.stringify({ 
          senderId: newMessage.sender.senderId 
        })}\n\n`);
      }
    });

    // 心跳检查
    setInterval(() => {
      res.write(':heartbeat\n\n');
      console.log("heartbeat!");
    }, 15000);

    res.on('close', () => {
      changeStream.close();
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send('Internal Server Error');
  }
});


// 通过传入的联系人ID，获取所有联系人的全部信息
router.post('/fullContact', function(req, res){

  const URLPath=process.env.EXPRESS_API_BASE_URL+"/static/profile_photos/";
  
  if(!req.session._id)
    return res.status(401).send();

  if(!Array.isArray(req.body.contactIds)) {
    return res.status(400).send('messageIds should be an array');
  };


  User.find({_id: {$in: req.body.contactIds}})
    .then(response=>{
      const fullContactArray=response.map(item=>({
          _id: item._id,
          username: item.username,
          profilePictureURL: URLPath+item.profilePictureName,
          isNewMessage: false
      }));
      res.status(200).send(fullContactArray);
    }
    ).catch(err=>{
      console.log(err);
      res.status(500).send('internal server error');
    })
})


module.exports = router;
