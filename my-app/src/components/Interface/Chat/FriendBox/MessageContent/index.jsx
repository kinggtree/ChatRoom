import React, { useEffect, useRef, useState } from "react";
import { Container } from "@mui/material";
import MessageInput from "./MessageInput";
import './styles.css';
import WebSocketContext from "./WebSocketContext";
const {REACT_APP_API_BASE_URL}=process.env;


function ChatMessage({ message, send, senderName }) {
  const isSentByCurrentUser = send;

  const style = {
    chatContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: isSentByCurrentUser ? 'flex-end' : 'flex-start',
      marginBottom: '4px'
    },
    chatMessage: {
      backgroundColor: '#f8f8f8',
      border: '1px solid #ddd',
      borderRadius: isSentByCurrentUser ? '25% 10%' : '10% 25%',
      padding: '2px',
      margin: '2px 0',
      maxWidth: '400px',
    },
    senderAndReceiver: {
      fontWeight: 'bold',
      marginBottom: '5px',
      fontSize: '12px'
    },
    messageContent: {
      margin: '7px',
    },
  };

  return (
    <div style={style.chatContainer}>
      <p style={style.senderAndReceiver}>{senderName}</p>
      <div style={style.chatMessage}>
        <p style={style.messageContent}>{message.messageContent}</p>
      </div>
    </div>
  );
}




// 聊天框部分
function MessageContent({userInfo, componentInfo}) {
  const ws=useRef(null);
  const [socket, setSocket]=useState();
  const [message, setMessage]=useState([]);


  useEffect(()=>{
    const senderId=componentInfo.senderId;
    const receiverId=componentInfo.receiverId;
    ws.current=new WebSocket(`ws://${REACT_APP_API_BASE_URL}?senderId=${senderId}&receiverId=${receiverId}`);
    setSocket(ws.current);
    
    // 在组件卸载或者 WebSocket 的值改变时需要关闭它：
    return () => {
      ws.current && ws.current.close();
      setMessage([]);
    };
  },[]);

  useEffect(()=>{
    const fetchMessage=async ()=>{
      try{
        socket.onmessage=function(event){
          let receivedMessage=JSON.parse(event.data);
          // 初始化数据
          if(!receivedMessage.isNewMessage || receivedMessage.messages!==undefined) {
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
        <div className="message-container">

        <div className="message-area">
          {message ? message.map((item)=>{
            item.send=false;
            // 如果是我方发送
            if(item.sender.senderId===userInfo._id)
            {
              item.send=true;
              return <ChatMessage {...item} key={item._id} senderName={userInfo.username} />   //这里的key是给react看的
            } else {
              return <ChatMessage {...item} key={item._id} senderName={componentInfo.friendInfo.username} />   //这里的key是给react看的
            };
          }) : <p>还没有消息哦，发送点什么吧！</p>}
        </div>

        {/* 输入框区域 */}
        <MessageInput {...userInfo} />

        </div>
      </Container>
    </WebSocketContext.Provider>
  );
}

export default MessageContent;
