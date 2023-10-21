import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import './styles.css';
import axios from "axios";

import { useDispatch } from 'react-redux';
import { fetchUserInfo } from "../../actions";


// 添加好友组件
function AddFriend({updateInfo, isOpen, setIsOpen}) {
  const[friendName, setFriendName]=useState('');
  const dispatch=useDispatch();

  const handleSubmit=function(e){
    axios.post('/api/newFriend', {friendName: friendName})
      .then(function(response){
        if(response.status===200){
          alert("添加好友完成");
          updateInfo();
          setIsOpen(false);
          setFriendName('');
          dispatch(fetchUserInfo());
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
