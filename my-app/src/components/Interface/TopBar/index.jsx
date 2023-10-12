import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Toolbar, Typography } from "@mui/material";
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
function AddFriend({updateInfo}) {
  const[friendName, setFriendname]=useState('');
  const[open, setOpen]=useState(false);

  const handleSubmit=function(e){
    e.preventDefault();
    axios.post('/api/newFriend', {friendName: friendName})
      .then(function(response){
        if(response.status===200){
          alert("Add frined finished!");
          updateInfo();
          setOpen(false);
        } else {
          alert(response.data);
        }
      }).catch(err=>{
        alert('err: '+err.response.data);
      });
  };

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return(
    <div>
      <Button variant='outlined' onClick={handleClick}>Add Friends</Button>
      <Dialog
      open={open} 
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

// 从userInfo中直接解析出姓名
function TopBar({username, updateInfo}) {

  const navigate=useNavigate();

  const toChat=function(){
    navigate('chat');
  };

  const toProfile=function(){
    navigate('profile')
  }

  return(
    <Toolbar className="top-bar">
      <Typography variant="h5" color="inherit" className="top-bar-welcome">
        Welcome, user {username}.
      </Typography>
      <Button variant="contained" onClick={toChat}>Chat</Button>
      <Button variant="contained" onClick={toProfile}>Personal Profile</Button>
      <AddFriend updateInfo={updateInfo}/>
      <LogOut />
    </Toolbar>
  )
}

export default TopBar;
