import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Toolbar, Typography, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import './styles.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LogOut(){

  const navigate=useNavigate();

  const handleSubmit=((e)=>{
    e.preventDefault();
    axios.post('/api/logout')
     .then((response)=>{
      if(response.status===200){
        alert("Successfully logout!");
        navigate('/');
      } else {
        alert("err: "+response.data);
      }
     }).catch((err)=>{
      alert("err: "+err.response.data);
     })
  });

  return(
    <Button className="top-bar-logout" variant="contained" color="error" onClick={handleSubmit}>
        Log Out
    </Button>
  )
}

// 添加好友组件
function AddFriend({updateInfo, isOpen, setIsOpen}) {
  const[friendName, setFriendname]=useState('');

  const handleSubmit=function(e){
    e.preventDefault();
    axios.post('/api/newFriend', {friendName: friendName})
      .then(function(response){
        if(response.status===200){
          alert("Add frined finished!");
          updateInfo();
          setIsOpen(false);
        } else {
          alert(response.data);
        }
      }).catch(err=>{
        alert('err: '+err.response.data);
      });
  };

  const handleClick = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return(
    <div>
      <Dialog
      open={isOpen} 
      aria-labelledby="alert-dialog-title" 
      aria-describedby="alert-dialog-description"
      >
        <DialogTitle>输入好友名称</DialogTitle>
        <DialogContent>
          <TextField
            value={friendName} 
            onChange={e=>{setFriendname(e.target.value)}}
            label='Friend Name'
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSubmit}>
            添加
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            关闭
          </Button>
        </DialogActions>
    </Dialog>
    </div>
  );
}


function TopBar({ username, updateInfo }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toChat = function () {
    navigate('chat');
    handleClose();
  };

  const toProfile = function () {
    navigate('profile');
    handleClose();
  };

  const openAddFriend = () => {
    setIsAddFriendOpen(true);
    handleClose();
  };

  return (
    <Toolbar className="top-bar">
      <Typography variant="h5" color="inherit" className="top-bar-welcome">
        Welcome, user {username}.
      </Typography>

      {/* Menu Button */}
      <Button variant="contained" onClick={handleClick} style={{ marginRight: '16px' }}>
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={toChat}>Chat</MenuItem>
        <MenuItem onClick={toProfile}>Personal Profile</MenuItem>
        <MenuItem onClick={openAddFriend}>Add Friend</MenuItem>
      </Menu>

      <AddFriend updateInfo={updateInfo} isOpen={isAddFriendOpen} setIsOpen={setIsAddFriendOpen}/>
      
      <LogOut />
    </Toolbar>
  );
}

export default TopBar;

