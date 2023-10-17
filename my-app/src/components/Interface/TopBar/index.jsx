import { Button, Toolbar, Typography, Menu, MenuItem } from "@mui/material";
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
        欢迎，用户 {username}.
      </Typography>

      {/* Menu Button */}
      <Button className="menu-button" variant="contained" onClick={handleClick}>
        菜单
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={toChat}>聊天</MenuItem>
        <MenuItem onClick={toProfile}>个人信息</MenuItem>
        <MenuItem onClick={openAddFriend}>添加好友</MenuItem>
      </Menu>

      <AddFriend updateInfo={updateInfo} isOpen={isAddFriendOpen} setIsOpen={setIsAddFriendOpen}/>
      
      <LogOut />
    </Toolbar>
  );
}

export default TopBar;

