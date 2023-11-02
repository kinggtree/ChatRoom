var express = require('express');
var router = express.Router();
require('dotenv').config();

var fs=require('fs');
const multer=require('multer');
const bcrypt = require('bcrypt');



const mongoose=require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.connect(process.env.EXPRESS_DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User=require("./schema/user");
const Message=require('./schema/message');
const Group=require('./schema/group');
const { clearInterval } = require('timers');
const ObjectId = mongoose.Types.ObjectId;


router.post('/ping', function(req, res){
  if(!req.session._id)
    return res.status(401).send();
  else
    return res.status(200).send('ping pang pong');
})


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
  if(!req.session._id)
    return res.status(401).send();
  try {

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
        'username': response.username,
        'contacts': response.contacts,
        'groups': response.groups,
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
        '_id': req.session._id,
        'username': response.username,
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
      {$pull: {contacts: {contactId: req.body.friendId}}},
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

  const newGender=req.body.gender;
  const newUsername=req.body.newUsername;


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

// 设置（多条）消息已读
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
});


// 创建新群组
router.post('/createNewGroup', async function(req, res){
  if(!req.session._id)
    return res.status(401).send();

  try{
    const groupMembers=req.body.groupMemberIds.map(id=>{
      return {userId: new mongoose.Types.ObjectId(id), nickname: ''};
    });
    groupMembers.push({userId: new mongoose.Types.ObjectId(req.session._id), nickname: ''});
  
    let newGroup=await Group.create({
      groupName: req.body.groupName,
      groupMembers: groupMembers,
      groupOwnerId: req.session._id,
      groupProfilePictureName: 'default_group.jpg',
      group_intro: 'A New Group.',
      group_notice:[{content: 'Original Notice.'}]
    });

    const groupMemberIds=groupMembers.map(member=>member.userId);
    await User.updateMany(
      {_id: {$in: groupMemberIds}},
      {$push: {groups: {groupId: newGroup._id}}}
    );

    if(newGroup){
      return res.status(200).send("成功创建群组");
    } else {
      return res.status(500).send("internal server error");
    }
  } catch(err) {
    console.log(err);
    return res.status(500).send("internal server error");
  };
});


// 获取所有群组基础信息
router.post('/getGroupInfo', function(req, res){
  if(!req.session._id)
    return res.status(401).send();

  const URLPath=process.env.EXPRESS_API_BASE_URL+"/static/profile_photos/";
  
  const groupIds = req.body.groups.map(group => group.groupId);

  Group.find({_id: {$in: groupIds}})
    .select('groupName groupProfilePictureName')
    .then(groups=>{
      const simpleGroups=groups.map(group=>{
        return {
          _id: group._id.toString(),
          groupName: group.groupName,
          groupProfilePictureURL: URLPath+group.groupProfilePictureName
        };
      });
      res.status(200).send(simpleGroups);
    })
    .catch(err=>{
      console.log(err);
      return res.status(500).send("internal server error");
    });
});

// 获取一个群组的所有信息
router.post('/getFullGroupInfo', async function (req, res) {
  if (!req.session._id)
    return res.status(401).send();

  if (!req.body.groupId)
    return res.status(400).send('无效的请求，缺少组ID');

  const URLPath = process.env.EXPRESS_API_BASE_URL + "/static/profile_photos/";

  try {
    const group = await Group.findOne({ _id: req.body.groupId });
    if (!group) {
      return res.status(404).send('未找到该组');
    }

    // 获取所有成员的userId
    const userIds = group.groupMembers.map(member => member.userId);

    // 一次性从数据库中查询所有成员的详细信息
    const users = await User.find({ '_id': { $in: userIds } });

    // 创建一个以userId为键，用户数据为值的对象，方便查找
    const userById = users.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});

    // 处理每个成员的数据
    const groupMemberFullInfo = group.groupMembers.map(member => {
      const theMember = userById[member.userId];
      if (theMember) {
        return {
          "_id": theMember._id,
          "name": member.nickname === '' ? theMember.username : member.nickname,
          "profilePictureURL": URLPath + theMember.profilePictureName,
        };
      }
    }).filter(Boolean); // 过滤掉可能的undefined值

    const fullGroupInfo = {
      _id: group._id,
      groupName: group.groupName,
      groupOwnerId: group.groupOwnerId,
      groupMembers: groupMemberFullInfo,
      groupProfilePictureURL: URLPath + group.groupProfilePictureName,
      group_intro: group.group_intro,
      group_notice: group.group_notice
    };

    res.status(200).json(fullGroupInfo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


// 向群组中添加通知
router.post('/addNotice', function(req, res){
  if (!req.session._id)
    return res.status(401).send();

  const group_notice={'content': req.body.content};
  Group.findOneAndUpdate(
    {_id: req.body.groupId},
    {$push:{'group_notice': group_notice}}
  ).then(()=>{
    res.status(200).send();
  }).catch(err=>{
    console.log(err);
    res.status(500).send('internal server error');
  })
});


// 删除群组中的群通知
router.post('/removeGroupNotice', async function(req, res) {
  if (!req.session._id)
    return res.status(401).send('Unauthorized');

  const noticeId = req.body.noticeId;
  const groupId = req.body.groupId; // 假设你会在请求体中发送要删除的通知所在的群组的ID

  if (!noticeId || !groupId) {
    return res.status(400).send('Bad Request: Missing parameters');
  };

  try {
    // 查找群组
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).send('Group not found');
    }

    // 删除通知
    const noticeIndex = group.group_notice.findIndex(notice => notice.id === noticeId);
    if (noticeIndex === -1) {
      return res.status(404).send('Notice not found');
    }
    group.group_notice.splice(noticeIndex, 1);

    // 保存更改
    await group.save();

    res.status(200).send('Notice removed successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('internal server error');
  }
});


router.post('/removeGroupMembers', function(req, res) {
  if (!req.session._id)
    return res.status(401).send('Unauthorized');

  const memberId=req.body.memberId;
  const groupId=req.body.groupId;

  Group.findByIdAndUpdate(
    {_id: groupId},
    {$pull: {groupMembers: {_id: memberId}}}
  ).then(()=>{
    res.status(200).send('succeesfully remove member!');
  }).catch(err=>{
    console.log(err);
    res.status(500).send('internal server error');
  });
})



// 更新新的群组介绍
router.post('/updateGroupIntro', function(req, res){
  if (!req.session._id) {
    return res.status(401).send('Unauthorized');
  }

  Group.findOneAndUpdate(
    {_id: req.body.groupId},
    {$set: {group_intro: req.body.newIntro}}
  ).then(()=>{
    res.status(200).send();
  }).catch(err=>{
    console.log(err);
    res.status(500).send('internal server error');
  });
});


// 上传并保存头像的API
// 设置存储的位置和文件名
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const path = require('path');

router.post('/uploadAvatar', upload.single('image'), async (req, res) => {
  try {
    const { _id, type } = req.body;
    if (!_id || !type) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    if (!req.session._id) {
      return res.status(401).send('Unauthorized');
    }

    // 获取文件
    const image = req.file.buffer;

    // 指定保存路径和文件名
    const imagePath = path.join(__dirname, 'static/profile_photos', `${_id}.png`);
    console.log(imagePath);

    // 保存文件
    fs.writeFileSync(imagePath, image);

    const update = type === 'personal' ? { profilePictureName: `${_id}.png` } : { groupProfilePictureName: `${_id}.png` };
    const Model = type === 'personal' ? User : Group;

    Model.findOneAndUpdate(
      { _id: _id },
      { $set: update }
    ).then(() => {
      res.json({ message: `${type} image uploaded successfully!`, status: 200 });
    }).catch(err => {
      console.error('Error updating database: ', err);
      res.status(500).json({ message: 'Internal server error' });
    });

  } catch (error) {
    console.error('Error uploading image: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// 由服务器主动发送未读提示(SSE连接)
router.get('/serverSendNew', async function(req, res) {
  if (!req.session._id) {
    return res.status(401).send('Unauthorized');
  }

  // 设置SSE相关的头部信息
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Content-Encoding', 'none');
  res.flushHeaders();  // 确保头部立即发送

  const userId = req.session._id;

  console.log("SSE connection open by user "+userId);

  try {
    // 获取初始化的所有未读消息数量
    const unreadMessages = await Message.find({
      'receiver.receiverId': new ObjectId(userId),
      unread: true
    });


    // 发送初始化数据到前端
    for (const msg of unreadMessages) {
      res.write(`data: ${JSON.stringify({ 
        senderId: msg.sender.senderId.toString(),
        messageId: msg._id
      })}\n\n`);
      res.flushHeaders();  // 确保数据立即发送
    }

    // 使用$match来过滤变更
    const pipeline = [
      {
        $match: {
          "fullDocument.receiver.receiverId": new ObjectId(userId)
        }
      }
    ];

    // 监听我方收到的消息
    const changeStream = Message.watch(pipeline);

    changeStream.on('change', (change) => {
      if (change.operationType === 'insert') {
        const newMessage = change.fullDocument;
        res.write(`data: ${JSON.stringify({ 
          senderId: newMessage.sender.senderId.toString(),
          messageId: newMessage._id
        })}\n\n`);
        res.flushHeaders();  // 确保头部立即发送
      }
    });

    // 心跳检查
    const heartbeatId=setInterval(() => {
      res.write(':heartbeat\n\n');
    }, 15000);

    // 5分钟后定时关闭
    const timeoutId = setTimeout(() => {
      console.log("SSE Connection timed out for user " + userId);
      clearInterval(heartbeatId);
      if (changeStream) changeStream.close();
      res.end();
    }, 600000);  // 600,000毫秒 == 10分钟

    // 关闭连接
    res.on('close', () => {
      clearInterval(heartbeatId);
      clearTimeout(timeoutId);  // 清除超时，防止在连接已关闭后仍然执行
      changeStream.close();
      console.log("SSE Connection closed by user "+userId);
      res.end();
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send('Internal Server Error');
  }
});




module.exports = router;
