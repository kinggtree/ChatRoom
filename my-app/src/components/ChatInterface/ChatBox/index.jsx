import React, { useEffect, useRef, useState } from "react";
import { Container } from "@mui/material";
import ChatInput from "../ChatInput";
import './styles.css';
import { useLocation } from "react-router-dom";
import WebSocketContext from "../WebSocketContext";

function ChatMessage( item ) {
  const style = {
    chatContainer: {
      display: 'flex',
      justifyContent: item.send ? 'flex-end' : 'flex-start',
    },
    chatMessage: {
      backgroundColor: '#f8f8f8',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
      margin: '10px 0',
      maxWidth: '400px',
    },
    senderAndReceiver: {
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    message: {
      marginTop: '10px',
    },
  };

  return (
    <div style={style.chatContainer}>
      <div style={style.chatMessage}>
        <p style={style.senderAndReceiver}>Sender: {item.sender.senderName}</p>
        <p style={style.senderAndReceiver}>Receiver: {item.receiver.receiverName}</p>
        <p style={style.message}>{item.message.messageContent}</p>
      </div>
    </div>
  );
}





function ChatBox(userInfo) {
  const ws=useRef(null);
  const [socket, setSocket]=useState();
  const [message, setMessage]=useState();
  const location=useLocation();


  useEffect(()=>{
    const senderId=userInfo._id;
    const receiverId=location.pathname.split('/')[2];
    ws.current=new WebSocket(`ws://localhost:5000?senderId=${senderId}&receiverId=${receiverId}`);
    setSocket(ws.current);
    
    // 在组件卸载或者 WebSocket 的值改变时需要关闭它：
    return () => {
      ws.current && ws.current.close();
  };
  },[location.pathname, userInfo._id]);

  useEffect(()=>{
    if(socket){
      socket.onmessage=function(event){
        setMessage(JSON.parse(event.data));
        console.log(JSON.parse(event.data));
        console.log("received message.");
        //需要后端发送消息
      }
    }
    }, [socket]);
  
  


  return (
    <WebSocketContext.Provider value={ws.current}>
      <Container style={{ height: '100%' }}>
        <div className="chat-container">
          {/* 聊天信息显示区域 */}
          <div className="message-area">
            {message ? message.map((item)=>{
              item.send=false;
              if(item.sender.senderName===userInfo.username)
                item.send=true;
            return <ChatMessage {...item} />
            }) : "Chat message goes here."}
          </div>

          {/* 输入框区域 */}
          <ChatInput {...userInfo} />
        </div>
      </Container>
    </WebSocketContext.Provider>
  );
}

export default ChatBox;
