import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

import { Container, IconButton, Paper, Typography, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, Toolbar } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ChatIcon from '@mui/icons-material/Chat';

import FriendProfile from "./FriendProfile";
import MessageContent from "./MessageContent";

import { useSelector, useDispatch } from "react-redux";
import { fetchFriendInfo } from "../../../../reduxActions/friendActions";

import './styles.css';


// 聊天框部分
function FriendBox() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading]=useState(true);
  const [idsInfo, setIdsInfo] = useState({
    senderId: '',
    receiverId: '',
  });
  const open = Boolean(anchorEl);
  const location=useLocation();
  const navigate=useNavigate();

  const dispatch=useDispatch();
  const userInfo=useSelector(state=>state.userInfo.item);
  const friendInfo=useSelector(state=>state.friendInfo.item);
  const friendInfoStatus=useSelector(state=>state.friendInfo.status);


  const senderId = userInfo._id;
  const {user_id} = useParams();

  // 获取启动聊天框所需信息
  useEffect(()=>{
    setIsLoading(true);
    dispatch(fetchFriendInfo(user_id));
  },[location.pathname, dispatch, user_id]);

  useEffect(()=>{
    if(friendInfoStatus==='succeeded'){
      setIdsInfo({
        senderId: senderId,
        receiverId: user_id,
      });
      setIsLoading(false);
    };

    return ()=>{
      setIsLoading(true);
    };
  }, [friendInfoStatus, senderId, user_id]);

  const openFriendMenu=(event)=>setAnchorEl(event.currentTarget);
  const closeFriendMenu=()=>setAnchorEl(null);

  const toFriendInfo=()=>{
    navigate('friendProfile');
    closeFriendMenu();
  };

  const toChat=()=>{
    navigate('');
    closeFriendMenu();
  };

  if(isLoading){
    return(<CircularProgress />)
  };

  return (
      <Container style={{ height: '100%' }}>
        <Paper className="chat-container">

          <Toolbar className="chat-topbar">
            <Typography variant="h6" className="friend-name">
              {friendInfo.username}
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
                <MessageContent idsInfo={idsInfo}  />
              } 
            />

            <Route
              path="/friendProfile"
              element={<FriendProfile />}
            />
          </Routes>

          </Paper>
      </Container>
  );
}

export default FriendBox;
