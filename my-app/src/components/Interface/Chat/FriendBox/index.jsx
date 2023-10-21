import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { Container, IconButton, Paper, Typography, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, Toolbar } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ChatIcon from '@mui/icons-material/Chat';

import FriendProfile from "./FriendProfile";
import MessageContent from "./MessageContent";

import { useSelector, useDispatch } from "react-redux";
import { fetchFriendBoxInfo } from "../../../../reduxActions/friendBoxActions";

import './styles.css';


// 聊天框部分
function FriendBox() {
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

  const dispatch=useDispatch();
  const userInfo=useSelector(state=>state.userInfo.item);
  const friendBoxInfo=useSelector(state=>state.friendBoxInfo.item);
  const friendBoxStatus=useSelector(state=>state.friendBoxInfo.status);

  const senderId = userInfo._id;
  const receiverId = location.pathname.split('/')[3];


  useEffect(()=>{
    dispatch(fetchFriendBoxInfo(receiverId));
    
  },[location.pathname]);

  useEffect(()=>{
    if(friendBoxStatus==='succeeded'){
      setComponentInfo({
        senderId: senderId,
        receiverId: receiverId,
        friendInfo: friendBoxInfo
      });
      setIsLoading(false);
    }

  }, [friendBoxStatus])

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
                <MessageContent componentInfo={componentInfo}  />
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
