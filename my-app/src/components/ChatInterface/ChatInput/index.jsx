//import axios from "axios";
import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import WebSocketContext from '../WebSocketContext'; 


function ChatInput(userInfo){
  const [content, setContent]=useState('');
  const location=useLocation();
  const ws=useContext(WebSocketContext);

  const handleSubmit=(e)=>{
    e.preventDefault();

    if(content.trim().length===0)
      return alert('text cannot be null.');

    const receiverId=location.pathname.split('/')[2];
    const receiverName=userInfo.contacts.find(array=>array.contactId===receiverId).contactUsername;

    const message={
      sender: {
        senderName: userInfo.username,
        senderId: userInfo._id
      },
      receiver:{
        receiverName: receiverName,
        receiverId: receiverId
      },
      message:{
        type: 'text',
        content: content
      }
    }

    if(ws && ws.readyState===WebSocket.OPEN){
      console.log("sended message!");
      ws.send(JSON.stringify(message));
      setContent('');
    }
  }

  const handleChange=(e)=>{
    setContent(e.target.value);
  }

  return (
    <div className="input-area">
      <TextField 
        fullWidth 
        variant="outlined" 
        placeholder="Type your message..." 
        onChange={handleChange}
        value={content}     // 确保输入框的值与状态同步
      />
      <Button variant="contained" onClick={handleSubmit} >Send</Button>
    </div>
  )
}

export default ChatInput;