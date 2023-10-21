import React, { useEffect, useRef, useState } from "react";
import { Container } from "@mui/material";
import MessageInput from "./MessageInput";
import './styles.css';
import WebSocketContext from "./WebSocketContext";
import axios from "axios";
import { useSelector } from "react-redux";
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
function MessageContent({componentInfo}) {
  const ws=useRef(null);
  const [socket, setSocket]=useState();
  const [message, setMessage]=useState([]);

  const userInfo=useSelector(state=>state.userInfo.item);


  useEffect(()=>{
    const senderId=componentInfo.senderId;
    const receiverId=componentInfo.receiverId;
    ws.current=new WebSocket(`ws://${REACT_APP_API_BASE_URL}?senderId=${senderId}&receiverId=${receiverId}`);

    ws.current.onerror=(error)=>{
      console.log(error);
    }

    ws.current.onopen=()=>{
      setSocket(ws.current);
    }
    
    // 在组件卸载或者 WebSocket 的值改变时需要关闭它：
    return () => {
      ws.current && ws.current.close();
      setMessage([]);
    };
  },[componentInfo.receiverId]);


  useEffect(() => {
    const fetchMessage = async () => {
      try {
        socket.onmessage = function(event) {
          const receivedMessage = JSON.parse(event.data);
          let newMessages = [];

          if (receivedMessage.messages) {
            newMessages = receivedMessage.messages;
          } else {
            newMessages = [receivedMessage];
          }

          setMessage(prevMessage => [...prevMessage, ...newMessages]);

          // 收集未读消息的ID
          // filter用来选择接收方是自己的消息
          const unreadMessageIds = newMessages
            .filter(m => ((m.receiver.receiverId===userInfo._id) && m.unread))
            .map(m => m._id);

          // 如果有未读消息，发送请求标记它们为已读
          if (unreadMessageIds.length > 0) {
              axios.post('/api/setIsRead', { messageIds: unreadMessageIds });
          }
        };
      } catch (err) {
        console.log(err);
      }
    };

    if (socket) {
      fetchMessage();
    }
}, [socket]);




  return (
    <WebSocketContext.Provider value={ws.current}>
      <Container style={{ height: '100%' }}>
        <div className="message-container">

        <div className="message-area">
          {message.length!==0 ? message.map((item)=>{
            const isSentByCurrentUser=item.sender.senderId===userInfo._id;
            const senderName=isSentByCurrentUser ? userInfo.username : componentInfo.friendInfo.username;
            return <ChatMessage {...item} send={isSentByCurrentUser} key={item._id} senderName={senderName} />
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
