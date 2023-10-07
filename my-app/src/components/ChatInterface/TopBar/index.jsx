import { Button, Dialog, DialogActions, DialogTitle, TextField, Toolbar, Typography } from "@mui/material";
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
        alert("Log out wrong!");
      }
     }).catch(()=>{
      alert("Log out wrong due to server error!");
     })
  });

  return(
    <Button className="top-bar-logout" variant="contained" color="error" onClick={handleSubmit}>
        Log Out
    </Button>
  )
}

function AddFriend() {
  const[friendName, setFriendname]=useState();
  const[open, setOpen]=useState(false);

  const handleSubmit=function(e){
    e.preventDefault();
    axios.post('/api/newFriend', {friendName: friendName})
      .then(function(response){
        if(response.status===200)
        {
          alert("Add frineds finished!");
          setOpen(false);
        }
        else
          alert("err: "+response.data);
      }).catch(err=>{
        alert('err: '+err.response.data);
      });
  };

  const handleClick=function(){
    setOpen(true);
  }

  return(
    <div>
      <Button variant='outlined' onClick={handleClick}>Add Friends</Button>
      <Dialog
      open={open} 
      aria-labelledby="alert-dialog-title" 
      aria-describedby="alert-dialog-description"
      >
        <DialogTitle>输入好友名称</DialogTitle>
        <DialogActions>
          <TextField
            value={friendName} 
            onChange={e=>{setFriendname(e.target.value)}}
            label='Friend Name'
          />
          <Button variant="contained" onClick={handleSubmit}>
            添加
          </Button>
        </DialogActions>
    </Dialog>
    </div>
    
  )
}

function TopBar(userInfo) {

  var username=userInfo.username;


  return(
    <Toolbar className="top-bar">
      <Typography variant="h5" color="inherit" className="top-bar-welcome">
        Welcome, user {username}.
      </Typography>
      <LogOut {...username}/>
      <AddFriend />
    </Toolbar>
  )
}

export default TopBar;
