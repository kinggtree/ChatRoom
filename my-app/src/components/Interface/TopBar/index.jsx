import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Toolbar, Typography, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import './styles.css';
import { useNavigate } from "react-router-dom";
import LogOut from "./LogOut";
import AddFriend from "./AddFriend";


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
      <Button className="menu-button" variant="contained" onClick={handleClick}>
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

