import React from "react";
import { TextField, Container } from "@mui/material";
import './styles.css';

function ChatBox() {
  return (
    <Container style={{ height: '100%' }}>
      <div className="chat-container">
        {/* 聊天信息显示区域 */}
        <div className="message-area">
          {"Chat messages go here."}
        </div>

        {/* 输入框区域 */}
        <div className="input-area">
          <TextField 
            fullWidth 
            variant="outlined" 
            placeholder="Type your message..." 
          />
        </div>
      </div>
    </Container>
  );
}

export default ChatBox;
