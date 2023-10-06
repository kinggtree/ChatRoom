import { Button, Toolbar, Typography } from "@mui/material";
import React from "react";
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

function TopBar(userInfo) {

  var username=userInfo.username;

  return(
    <Toolbar className="top-bar">
      <Typography variant="h5" color="inherit" className="top-bar-welcome">
        Welcome, user {username}.
      </Typography>
      <LogOut {...username}/>
    </Toolbar>
  )
}

export default TopBar;
