import React, { useEffect, useRef, useState } from "react";
import { Button, CircularProgress, Container } from "@mui/material";
import MessageInput from "./MessageInput";
import './styles.css';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WebSocketContext from "./WebSocketContext";
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
function MessageContent({idsInfo}) {
  const ws=useRef(null);
  const [socket, setSocket]=useState();
  const [message, setMessage]=useState([]);

  const userInfo=useSelector(state=>state.userInfo.item);
  const friendInfo=useSelector(state=>state.friendInfo.item);

  const [isLoading, setIsLoading]=useState(true);
  const [isConnected, setIsConnected]=useState(false);

  // 实现按钮，消息滚动到最下面
  const messageEndRef=useRef(null);

  // 触发滚动到底部
  const scrollToBottom=()=>{
    messageEndRef.current?.scrollIntoView({behavior: "smooth"});
  };

  // 检查是否滚动到底部(目前这里还是有bug)(目前问题主要集中在element.scrollTop总是为0上)
  const isScrolledToBottom = (element) => {
    const tolerance = 5; // 你可以根据需要调整这个容差值
    return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < tolerance;
  };
  


  useEffect(()=>{
    const senderId=idsInfo.senderId;
    const receiverId=idsInfo.receiverId;
    ws.current=new WebSocket(`ws://${REACT_APP_API_BASE_URL}?senderId=${senderId}&receiverId=${receiverId}&isGroup=false`);

    ws.current.onerror=(error)=>{
      console.log(error);
      setIsLoading(true);
    }

    ws.current.onopen=()=>{
      setIsLoading(false);
      setIsConnected(true);
      setSocket(ws.current);
    }
    
    // 在组件卸载或者 WebSocket 的值改变时需要关闭它：
    return () => {
      ws.current && ws.current.close();
      setMessage([]);
      // 设置正在加载
      setIsLoading(true);
      setIsConnected(false);
    };
  },[idsInfo.receiverId, idsInfo.senderId]);



  // 获取新消息，添加到目前的消息列表并渲染
  useEffect(() => {
    // 定义处理消息的函数
    const fetchMessage = async () => {
      try {
        socket.onmessage = function(event) {
          const receivedMessage = JSON.parse(event.data);
          let newMessages = [];

          // 如果第一次获取所有消息，这个时候后端会发送一个叫messages的数组
          if (receivedMessage.messages) {
            newMessages = receivedMessage.messages;
          } else {
            newMessages = [receivedMessage];
          }

          setMessage(prevMessage => [...prevMessage, ...newMessages]);

        };
      } catch (err) {
        console.log(err);
      }
    };

    // 如果socket有新消息
    if (socket && isConnected) {
      fetchMessage();
    };
  }, [socket, isConnected]);


  
  useEffect(()=>{
    if (messageEndRef.current) {
      // 检查是否滚动到底部 
      const scrolledToBottom = isScrolledToBottom(messageEndRef.current.parentElement);
  
      // 如果已经滚动到底部，新消息到来时自动滚动到底部
      if (scrolledToBottom) {
        scrollToBottom();
      };
    }
  }, [message]);



  if(isLoading){
    return <CircularProgress />
  };

  return (
    <WebSocketContext.Provider value={ws.current}>
      <Container style={{ height: '60vh', overflowY: 'auto', position: 'relative' }}>
        <div className="message-container">

          <div className="message-area">
            {message.length!==0 ? message.map((item)=>{
              const isSentByCurrentUser=item.sender.senderId===userInfo._id;
              const senderName=isSentByCurrentUser ? userInfo.username : friendInfo.username;
              return <ChatMessage {...item} send={isSentByCurrentUser} key={item._id} senderName={senderName} />
            }) : <p>还没有消息哦，发送点什么吧！</p>}
            <div ref={messageEndRef} />
          </div>

        </div>
      </Container>

      <Button
        onClick={scrollToBottom}
        style={{
        margin: 'auto',
        zIndex: 1  // 确保按钮在其他内容之上
        }}
      >
        <ArrowDownwardIcon />
      </Button>
      <MessageInput idsInfo={idsInfo} scrollToBottom={scrollToBottom}/>
      
    </WebSocketContext.Provider>
  );
}

export default MessageContent;
