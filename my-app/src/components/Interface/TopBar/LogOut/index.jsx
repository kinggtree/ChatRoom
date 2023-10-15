import { Button, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import './styles.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LogOut(){
  const navigate=useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);


  const handleLogout=((e)=>{
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

  const handleClick=(event)=>{
    setAnchorEl(event.currentTarget);
  };

  const handleClose=()=>{
    setAnchorEl(null);
  };

  return(
    <div>
      <Button className="logout-button" variant="contained" onClick={handleClick} color="error">
        Log Out
    </Button>
    <Menu
      id="confirm-logout"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Sure?</MenuItem>
      </Menu>
    </div>
    
  )
}

export default LogOut;