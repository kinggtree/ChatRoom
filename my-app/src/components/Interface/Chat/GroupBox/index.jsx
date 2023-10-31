import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

import { Container, IconButton, Paper, Typography, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, Toolbar } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ChatIcon from '@mui/icons-material/Chat';

import GroupProfile from "./GroupProfile";
import MessageContent from "./MessageContent";

import { useSelector, useDispatch } from "react-redux";
import { fetchFullGroupInfo } from "../../../../reduxActions/fullGroupInfoActions";

import './styles.css';


// 聊天框部分
function GroupBox() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading]=useState(true);
  const [idsInfo, setIdsInfo] = useState({
    senderId: '',
    groupId: '',
  });
  const open = Boolean(anchorEl);
  const location=useLocation();
  const navigate=useNavigate();

  const dispatch=useDispatch();
  const userInfo=useSelector(state=>state.userInfo.item);
  const fullGroupInfo=useSelector(state=>state.fullGroupInfo.item);
  const fullGroupInfoStatus=useSelector(state=>state.fullGroupInfo.status);


  const senderId = userInfo._id;
  const {group_id} = useParams();

  // 获取启动聊天框所需信息
  useEffect(()=>{
    setIsLoading(true);
    dispatch(fetchFullGroupInfo(group_id));
  },[location.pathname, dispatch, group_id]);

  useEffect(()=>{
    if(fullGroupInfoStatus==='succeeded'){
      setIdsInfo({
        senderId: senderId,
        groupId: group_id,
      });
      setIsLoading(false);
    }
  }, [fullGroupInfoStatus, group_id, senderId]);

  const openGroupMenu=(event)=>setAnchorEl(event.currentTarget);
  const closeGroupMenu=()=>setAnchorEl(null);

  const toGroupInfo=()=>{
    navigate('groupProfile');
    closeGroupMenu();
  };

  const toChat=()=>{
    navigate('');
    closeGroupMenu();
  };

  if(isLoading){
    return(<CircularProgress />)
  };

  return (
      <Container style={{ height: '100%' }}>
        <Paper className="chat-container">

          <Toolbar className="chat-topbar">
            <Typography variant="h6" className="friend-name">
              {fullGroupInfo.groupName}
            </Typography>

            <IconButton 
              edge="end" 
              aria-label="more" 
              aria-controls={open ? 'friend-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={openGroupMenu} 
              className="more-button">
              <MoreVertIcon />
            </IconButton>

            <Menu
              id="friend-menu" 
              anchorEl={anchorEl}
              open={open} 
              onClose={closeGroupMenu}
            >
              <MenuItem onClick={toGroupInfo}>
                <ListItemIcon>
                  <PermIdentityIcon />
                </ListItemIcon>
                <ListItemText>群组信息</ListItemText>
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
              path="/groupProfile"
              element={<GroupProfile />}
            />
          </Routes>

          </Paper>
      </Container>
  );
}

export default GroupBox;
