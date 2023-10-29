//import axios from "axios";
import React, { useContext, useState, useRef } from "react";
import { TextField, Button } from "@mui/material";
import WebSocketContext from '../WebSocketContext'; 
import SendIcon from '@mui/icons-material/Send';
import "./styles.css";


function MessageInput({idsInfo, scrollToBottom}){
  const [content, setContent]=useState('');
  const ws=useContext(WebSocketContext);


  const handleSubmit=()=>{

    if(content.trim().length===0)
      return alert('text cannot be null.');

    const message={
      sender: {
        senderId: idsInfo.senderId
      },
      receiver:{
        receiverId: idsInfo.groupId
      },
      message:{
        type: 'text',
        content: content
      }
    };

    if(ws && ws.readyState===WebSocket.OPEN){
      ws.send(JSON.stringify(message));
      setContent('');
    }

    scrollToBottom();

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
        className="input-message" 
      />
      <Button variant="contained" onClick={handleSubmit} className="send-button" endIcon={<SendIcon />}>Send</Button>
    </div>
  );
}

export default MessageInput;