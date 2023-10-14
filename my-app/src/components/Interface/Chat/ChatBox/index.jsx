import React, { useEffect, useRef, useState } from "react";
import { Container, Typography } from "@mui/material";
import ChatInput from "../ChatInput";
import './styles.css';
import { useLocation } from "react-router-dom";
import WebSocketContext from "../WebSocketContext";
const {REACT_APP_API_BASE_URL}=process.env;

function ChatMessage({ sender, message, send }) {
  const isSentByCurrentUser = send;

  const style = {
    chatContainer: {
      display: 'flex',
      justifyContent: isSentByCurrentUser ? 'flex-end' : 'flex-start',
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
    messageContent: {
      marginTop: '10px',
    },
  };

  return (
    <div style={style.chatContainer}>
      <div style={style.chatMessage}>
        <p style={style.senderAndReceiver}>Sender: {sender.senderName}</p>
        <p style={style.messageContent}>{message.messageContent}</p>
      </div>
    </div>
  );
}




// 聊天框部分
function ChatBox(userInfo) {
  const ws=useRef(null);
  const [socket, setSocket]=useState();
  const [message, setMessage]=useState([]);
  const [friendInfo, setFriendInfo]=useState({});
  const location=useLocation();


  useEffect(()=>{
    const senderId=userInfo._id;
    const receiverId=location.pathname.split('/')[3];
    ws.current=new WebSocket(`ws://${REACT_APP_API_BASE_URL}?senderId=${senderId}&receiverId=${receiverId}`);
    setSocket(ws.current);
    
    // 在组件卸载或者 WebSocket 的值改变时需要关闭它：
    return () => {
      ws.current && ws.current.close();
      setMessage([]);
    };
  },[location.pathname, userInfo._id]);

  useEffect(()=>{
    const fetchMessage=async ()=>{
      try{
        socket.onmessage=function(event){
          let receivedMessage=JSON.parse(event.data);
          // 初始化数据
          if(!receivedMessage.isNewMessage || receivedMessage.messages!==undefined) {
            setFriendInfo(receivedMessage.friendInfo);
            receivedMessage.messages.map((item)=>{
              setMessage((prevMessage)=>{
                return [...prevMessage, item];
              });
            });
            console.log("received message.");
          }
          // 新消息
          else {
            console.log("received new message.");
            setMessage((prevMessage)=>{
              return [...prevMessage, receivedMessage];
            })
          }
      }
      } catch (err){
        console.log(err);
      }
    };

    if(socket){
      fetchMessage();
    }
    
  }, [socket]);
  


  return (
    <WebSocketContext.Provider value={ws.current}>
      <Container style={{ height: '100%' }}>
        <div className="chat-container">
          <Typography variant="h6">
            {friendInfo.username}
          </Typography>
          {/* 聊天信息显示区域 */}
          <div className="message-area">
            {message ? message.map((item)=>{
              item.send=false;
              if(item.sender.senderName===userInfo.username)
                item.send=true;
            return <ChatMessage {...item} key={item._id} />   //这里的key是给react看的
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
