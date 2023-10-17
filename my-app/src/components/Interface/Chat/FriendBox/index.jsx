import React, { useEffect, useState } from "react";
import { Container, IconButton, Paper, Typography, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, Toolbar } from "@mui/material";
import './styles.css';
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ChatIcon from '@mui/icons-material/Chat';
import FriendProfile from "./FriendProfile";
import MessageContent from "./MessageContent";
import axios from "axios";


// 聊天框部分
function FriendBox(userInfo) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading]=useState(true);
  const [componentInfo, setComponentInfo] = useState({
    senderId: '',
    receiverId: '',
    friendInfo: {
      username: '',
      self_intro: '',
      gender: '',
      profilePictureURL: ''
    }
  });
  const open = Boolean(anchorEl);
  const location=useLocation();
  const navigate=useNavigate();


  useEffect(()=>{
    const senderId = userInfo._id;
    const receiverId = location.pathname.split('/')[3];
    axios.post('/api/getFriendInfo', {friendId: receiverId})
      .then((response)=>{
        setComponentInfo({
          senderId: senderId,
          receiverId: receiverId,
          friendInfo: {
            username: response.data.username,
            self_intro: response.data.self_intro,
            gender: response.data.gender,
            profilePictureURL: response.data.profilePictureURL
          }
        });
        setIsLoading(false);
      }).catch((err)=>{
        console.log(err);
      });
  },[userInfo, location.pathname]);

  const openFriendMenu=(event)=>setAnchorEl(event.currentTarget);
  const closeFriendMenu=()=>setAnchorEl(null);

  const toFriendInfo=()=>{
    navigate('friendProfile');
    closeFriendMenu();
  }

  const toChat=()=>{
    navigate('');
    closeFriendMenu();
  }

  if(isLoading){
    return(<CircularProgress />)
  }

  return (
      <Container style={{ height: '100%' }}>
        <Paper className="chat-container">

          <Toolbar className="chat-topbar">
            <Typography variant="h6" className="friend-name">
              {componentInfo.friendInfo.username}
            </Typography>

            <IconButton 
              edge="end" 
              aria-label="more" 
              aria-controls={open ? 'friend-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={openFriendMenu} 
              className="more-button">
              <MoreVertIcon />
            </IconButton>

            <Menu
              id="friend-menu" 
              anchorEl={anchorEl}
              open={open} 
              onClose={closeFriendMenu}
            >
              <MenuItem onClick={toFriendInfo}>
                <ListItemIcon>
                  <PermIdentityIcon />
                </ListItemIcon>
                <ListItemText>好友信息</ListItemText>
              </MenuItem>

              <MenuItem onClick={toChat}>
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText>聊天</ListItemText>
              </MenuItem>
            </Menu>

          </Toolbar>

          <Routes>
            <Route
              path="/*"
              element={
                <MessageContent userInfo={userInfo} componentInfo={componentInfo}  />
              } 
            />

            <Route
              path="/friendProfile"
              element={<FriendProfile componentInfo={componentInfo} />}
            />
          </Routes>

          </Paper>
      </Container>
  );
}

export default FriendBox;
