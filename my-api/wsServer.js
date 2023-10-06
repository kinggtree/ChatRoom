// mongoose部分
var WebSocket=require('ws');
const mongoose=require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://127.0.0.1/ChatRoom", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const Message=require("./schema/message");

// WebSocket部分
const wss=new WebSocket.Server({noServer: true});

wss.on('connection', (ws, req)=>{
  console.log('WebSocket connection established.');


  ws.on('message', (messageObj)=>{
    try {
      Message.create({
        // 见express api部分
      })
    } catch (err) {
      console.log(err);
      res.status(500).send("internal server error!");
    }
  });

  const senderId=new mongoose.Types.ObjectId(req.body._id);
  const receiverId=new mongoose.Types.ObjectId(req.body.receiverId);    //这里需要ChatBox来正确传入receiverId

  Message.find({
    'sender.senderId': senderId,
    'receiver.receiverId': receiverId
  })
    .then((messages, err)=>{
      if(err){
        console.log(err);
        return;
      }

      ws.send(JSON.stringify(messages));
    });

})

module.exports = wss;