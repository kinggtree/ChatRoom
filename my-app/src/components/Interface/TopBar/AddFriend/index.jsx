import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Toolbar, Typography, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import './styles.css';
import axios from "axios";

// 添加好友组件
function AddFriend({updateInfo, isOpen, setIsOpen}) {
  const[friendName, setFriendName]=useState('');

  const handleSubmit=function(e){
    axios.post('/api/newFriend', {friendName: friendName})
      .then(function(response){
        if(response.status===200){
          alert("Add frined finished!");
          updateInfo();
          setIsOpen(false);
          setFriendName('');
        } else {
          alert(response.data);
        }
      }).catch(err=>{
        alert('err: '+err.response.data);
      });
  };

  const handleClose = () => setIsOpen(false);

  const handleKeyDown=(e)=>{
    if(e.key==='Enter'){
      handleSubmit();
    }
  };

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
            onKeyDown={handleKeyDown}
            onChange={e=>{setFriendName(e.target.value)}}
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

export default AddFriend;
