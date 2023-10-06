import React, { useLayoutEffect } from "react";
import { Container } from "@mui/material";
import ChatInput from "../ChatInput";
import './styles.css';
import axios from "axios";

function ChatBox(userInfo) {
  const ws=useRef<WebSocket | null>(null);
  const [message, setMessage]=useState();

  useLayoutEffect(()=>{
    ws.current=new WebSocket('ws://localhost:5000');
    //https://zhuanlan.zhihu.com/p/275128511
  })


  return (
    <Container style={{ height: '100%' }}>
      <div className="chat-container">
        {/* 聊天信息显示区域 */}
        <div className="message-area">
          {"Chat messages go here."}
        </div>

        {/* 输入框区域 */}
        <ChatInput {...userInfo} />
      </div>
    </Container>
  );
}

export default ChatBox;
