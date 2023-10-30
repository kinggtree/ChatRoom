import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, CircularProgress, Container } from "@mui/material";
import MessageInput from "./MessageInput";
import './styles.css';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WebSocketContext from "./WebSocketContext";
import { useSelector } from "react-redux";
const {REACT_APP_API_BASE_URL}=process.env;


function ChatMessage({ message, send, senderName, senderAvatarURL }) {
  const isSentByCurrentUser = send;

  const style = {
    chatContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: isSentByCurrentUser ? 'flex-end' : 'flex-start',
      marginBottom: '4px'
    },
    messageContainer: {
      display: 'flex',
      flexDirection: isSentByCurrentUser ? 'row-reverse' : 'row',
      alignItems: 'center',
      maxWidth: '400px',
    },
    chatMessage: {
      backgroundColor: '#f8f8f8',
      border: '1px solid #ddd',
      borderRadius: '15px',
      padding: '8px',
      margin: isSentByCurrentUser ? '0 8px 0 0' : '0 0 0 8px', // Add margin to create space between the avatar and the message
    },
    senderAndReceiver: {
      fontWeight: 'bold',
      marginBottom: '5px',
      fontSize: '12px'
    },
    messageContent: {
      margin: '7px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%', // Make the avatar circular
    },
  };

  return (
    <div style={style.chatContainer}>
      <p style={style.senderAndReceiver}>{senderName}</p>
      <div style={style.messageContainer}>
        <Avatar
          alt={senderName + "'s profile picture."}
          src={senderAvatarURL}
          size="40px" // Assuming your Avatar component accepts a size prop
        />
        <div style={style.chatMessage}>
          <p style={style.messageContent}>{message.messageContent}</p>
        </div>
      </div>
    </div>
  );
};




// 聊天框部分
function MessageContent({idsInfo}) {
  const ws=useRef(null);
  const [socket, setSocket]=useState();
  const [message, setMessage]=useState([]);

  const userInfo=useSelector(state=>state.userInfo.item);
  const fullGroupInfo=useSelector(state=>state.fullGroupInfo.item);

  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading]=useState(true);

  // 实现按钮，消息滚动到最下面
  const messageEndRef=useRef(null);

  // 触发滚动到底部
  const scrollToBottom=()=>{
    messageEndRef.current?.scrollIntoView({behavior: "smooth"});
  };

  // 检查是否滚动到底部(目前这里还是有bug)
  const isScrolledToBottom = (element) => {
    return element.scrollHeight - element.scrollTop === element.clientHeight;
  };  


  // 建立群组连接
  useEffect(()=>{
    const senderId=idsInfo.senderId;
    const groupId=idsInfo.groupId;
    ws.current=new WebSocket(`ws://${REACT_APP_API_BASE_URL}?senderId=${senderId}&receiverId=${groupId}&isGroup=true`);

    ws.current.onerror=(error)=>{
      console.log(error);
      setIsLoading(true);
    }

    ws.current.onopen=()=>{
      setIsConnected(true);
      setIsLoading(false);
      setSocket(ws.current);
    }
    
    // 在组件卸载或者 WebSocket 的值改变时需要关闭它：
    return () => {
      ws.current && ws.current.close();
      setMessage([]);
      // 设置正在加载
      setIsLoading(true);
    };
  },[idsInfo.groupId, idsInfo.senderId]);


  // 获取新消息，添加到目前的消息列表并渲染
  useEffect(() => {
    // 定义处理消息的函数
    const fetchMessage = async () => {
      try {
        socket.onmessage = function(event) {
          const receivedMessage = JSON.parse(event.data);
          let newMessages = [];
          console.log(receivedMessage);

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

    return ()=>{
      if(socket){
        socket.onmessage=null;
      }
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
              const senderName=fullGroupInfo.groupMembers[item.sender.senderId].name;
              const senderAvatarURL=fullGroupInfo.groupMembers[item.sender.senderId].profilePictureURL;
              return <ChatMessage {...item} send={isSentByCurrentUser} key={item._id} senderName={senderName} senderAvatarURL={senderAvatarURL} />
            }) : <p>群组内还没有什么消息哦，发送点什么吧！</p>}
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
