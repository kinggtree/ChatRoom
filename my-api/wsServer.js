// mongoose部分
var WebSocket=require('ws');
const mongoose=require("mongoose");
mongoose.Promise = require("bluebird");
const url = require('url');
mongoose.connect("mongodb://127.0.0.1/ChatRoom", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const Message=require("./schema/message");

const wss=new WebSocket.Server({noServer: true});

// 好友模式，初始化所有数据
async function initializeFriendMessages(ws, senderId, receiverId){
  let messageContent={
    'messages': []
  };

  try{
    const messages=await Message.find({
      $or: [
        {'sender.senderId': senderId, 'receiver.receiverId': receiverId},
        {'sender.senderId': receiverId, 'receiver.receiverId': senderId}
      ] 
    });


    //设置messageContent数据
    messages.map((item)=>{
      let tempMessage={
        '_id':'',
        'sender':{
          'senderId':''
        },
        'receiver':{
          'receiverId': ''
        },
        'message':{
          'messageType': '',
          'messageContent': ''
        },
        'date':'',
        'unread': false
      };
      tempMessage._id=item._id;
      tempMessage.sender.senderId=item.sender.senderId;
      tempMessage.receiver.receiverId=item.receiver.receiverId;
      tempMessage.message=item.message;
      tempMessage.unread=item.unread;
      //tempMessage.date=item.date.date.toLocaleString();    //时间部分后面再说
      messageContent.messages.push(tempMessage);
    });
  } catch(err){
    console.log("message cannot be saved!: ",err);
    ws.send('error, message cannot be saved!');
  };

  console.log("sended all messages from server! (friend mode)");
  ws.send(JSON.stringify(messageContent));
}

// 群组模式，初始化所有数据
async function initializeGroupMessages(ws, groupId){
  let messageContent={
    'messages': []
  };

  try{
    const messages=await Message.find(
      { "receiver.receiverId": groupId }
    );

    //设置messageContent数据
    messages.map((item)=>{
      let tempMessage={
        '_id':'',
        'sender':{
          'senderId':''
        },
        'receiver':{
          'receiverId': ''
        },
        'message':{
          'messageType': '',
          'messageContent': ''
        },
        'date':'',
        'unread': false
      };
      tempMessage._id=item._id;
      tempMessage.sender.senderId=item.sender.senderId;
      tempMessage.receiver.receiverId=item.receiver.receiverId;
      tempMessage.message=item.message;
      tempMessage.unread=item.unread;
      //tempMessage.date=item.date.date.toLocaleString();    //时间部分后面再说
      messageContent.messages.push(tempMessage);
    });
  } catch(err){
    console.log("message cannot be saved!: ",err);
    ws.send('error, message cannot be saved!');
  };

  console.log("sended all messages from server! (group mode)");
  ws.send(JSON.stringify(messageContent));
}

// 新消息提交
function handleMessage(message) {
  try {
    const messageObj=JSON.parse(message);
    Message.create({
      sender: {
        senderId: new mongoose.Types.ObjectId(messageObj.sender.senderId)
      },
      receiver:{
        receiverId: new mongoose.Types.ObjectId(messageObj.receiver.receiverId)
      },
      message: {
        messageType: messageObj.message.type,
        messageContent: messageObj.message.content
      }
    });
  } catch (err) {
    console.log(err);
  }
}

// 好友模式，当数据集产生变化的时候
function handleDBChangeFriend(ws, senderId, receiverId, change) {
  console.log("handling friend change...");
  if(change.operationType==='insert'){
    const newMessage=change.fullDocument;
    if(newMessage.sender.senderId.equals(senderId) && newMessage.receiver.receiverId.equals(receiverId)){
      newMessage.isNewMessage=true;
      console.log("sended new message from server!");
      ws.send(JSON.stringify(newMessage));
    } else if(newMessage.sender.senderId.equals(receiverId) && newMessage.receiver.receiverId.equals(senderId)){
      newMessage.isNewMessage=true;
      console.log("sended new message from server! (friend mode)");
      ws.send(JSON.stringify(newMessage));
    }
  }
}

// 群组模式，当数据集产生变化的时候
function handleDBChangeGroup(ws, groupId, change) {
  console.log("handling group change...");
  if(change.operationType==='insert'){
    const newMessage=change.fullDocument;
    if(newMessage.receiver.receiverId.equals(groupId)){
      newMessage.isNewMessage=true;
      console.log("sended new message from server! (group mode)");
      ws.send(JSON.stringify(newMessage));
    }
  }
}


wss.on('connection', (ws, req)=>{
  console.log('WebSocket connection established.');

  // 使用URL来解析
  const parsedUrl=url.parse(req.url, true);
  const senderId=new mongoose.Types.ObjectId(parsedUrl.query.senderId);
  const receiverId=new mongoose.Types.ObjectId(parsedUrl.query.receiverId);
  const isGroup=JSON.parse(parsedUrl.query.isGroup);


  // 建立连接后发送所有数据
  if(isGroup)
    initializeGroupMessages(ws, receiverId);
  else
    initializeFriendMessages(ws, senderId, receiverId);


  ws.on('message', (ws, message)=>{
    handleMessage(ws, message)
  });

  // MongoDB 数据变化时发送新消息
  // MongoDB必须为副本集
  const changeStream=Message.watch();

  changeStream.on('change', (change)=>{
    if(isGroup)
      handleDBChangeGroup(ws, receiverId, change);
    else
      handleDBChangeFriend(ws, senderId, receiverId, change)
  });

  // 关闭连接
  ws.on('close', () => {
    console.log('WebSocket connection closed.');
    changeStream.close();
  });

});

module.exports = wss;