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
const Message=require('../schema/message');

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


// 未来可以实现由客户端主动发送未读提示
router.get('/serverSendNew', function(req, res){
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const changeStream=Message.watch();

  changeStream.on('change', (change)=>{
    if(change.operationType==='insert'){
      const newMessage=change.fullDocument;
      if(newMessage.receiver.receiverId.toString()===req.body.userId){
        res.write(newMessage.sender.senderId);
      };
    };
  });
});


module.exports = router;
