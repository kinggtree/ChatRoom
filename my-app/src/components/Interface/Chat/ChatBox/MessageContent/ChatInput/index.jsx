//import axios from "axios";
import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import WebSocketContext from '../WebSocketContext'; 
import SendIcon from '@mui/icons-material/Send';
import "./styles.css";


function ChatInput(userInfo){
  const [content, setContent]=useState('');
  const location=useLocation();
  const ws=useContext(WebSocketContext);

  const handleSubmit=(e)=>{

    if(content.trim().length===0)
      return alert('text cannot be null.');

    const receiverId=location.pathname.split('/')[3];
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
    };

    if(ws && ws.readyState===WebSocket.OPEN){
      console.log("sended message!");
      ws.send(JSON.stringify(message));
      setContent('');
    }
  };

  const handleChange=(e)=>{
    setContent(e.target.value);
  };

  const handleKeyDown=(e)=>{
    if(e.key==='Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="input-area">
      <TextField 
        fullWidth 
        variant="outlined" 
        placeholder="Type your message..." 
        onChange={handleChange} 
        onKeyDown={handleKeyDown}
        value={content}
        className="input" 
      />
      <Button variant="contained" onClick={handleSubmit} className="send" endIcon={<SendIcon />}>Send</Button>
    </div>
  );
}

export default ChatInput;