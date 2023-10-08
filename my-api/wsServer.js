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
const changeStream=Message.watch();


// WebSocket部分
const wss=new WebSocket.Server({noServer: true});

wss.on('connection', (ws, req)=>{
  console.log('WebSocket connection established.');

  // 使用URL来解析
  const parsedUrl=url.parse(req.url, true);
  const senderId=new mongoose.Types.ObjectId(parsedUrl.query.senderId);
  const receiverId=new mongoose.Types.ObjectId(parsedUrl.query.receiverId);


  // 建立连接后发送所有数据
  const initMessage=()=>{
    Message.find({
      $or: [
        {'sender.senderId': senderId, 'receiver.receiverId': receiverId},
        {'sender.senderId': receiverId, 'receiver.receiverId': senderId}
      ] 
    })
      .then((messages, err)=>{
        if(err){
          console.log(err);
          return;
        }
        console.log("sended all messages from server!");
        ws.send(JSON.stringify(messages));
      }
    ).catch((err)=>{
      console.log("message cannot be saved!: ",err);
      ws.send(JSON.stringify({error: 'message cannot be saved!'}));
    });
  };
  initMessage();


  ws.on('message', (message)=>{
    const messageObj=JSON.parse(message);
    try {
      Message.create({
        sender: {
          senderName: messageObj.sender.senderName,
          senderId: new mongoose.Types.ObjectId(messageObj.sender.senderId)
        },
        receiver:{
          receiverName: messageObj.receiver.receiverName,
          receiverId: new mongoose.Types.ObjectId(messageObj.receiver.receiverId)
        },
        message: {
          messageType: messageObj.message.type,
          messageContent: messageObj.message.content
        },
        date: new Date()
      })
    } catch (err) {
      console.log(err);
    }
  });

  // MongoDB 数据变化时发送新消息
  // MongoDB必须为副本集
  changeStream.on('change', (change)=>{
    if(change.operationType==='insert'){
      const newMessage=change.fullDocument;
      console.log("sended new message from server!");
      ws.send(JSON.stringify(newMessage));
    }
  })

  // 关闭连接
  ws.on('close', () => {
    console.log('WebSocket connection closed.');
  });

});

module.exports = wss;