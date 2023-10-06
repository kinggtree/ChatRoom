import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { TextField, Button } from "@mui/material";


function ChatInput(userInfo){
  const [content, setContent]=useState();
  const location=useLocation();

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

    console.log(message);

    axios.post('/api/sendMessage', message)
      .then((response)=>{
        if(response.status===200){
          //清除输入框内容（暂未解决）
          setContent('');
        }
      }).catch((err)=>{
        alert('error occurred: ',err.response);
    });
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