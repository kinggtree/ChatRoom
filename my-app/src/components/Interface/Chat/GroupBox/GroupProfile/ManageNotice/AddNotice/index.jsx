import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import './styles.css';
import axios from "axios";


// 添加好友组件
function AddNotice({ groupId, isOpen, setIsOpen, dispatchFullGroupInfo }) {
  const[content, setContent]=useState('');

  const handleSubmit=function(){
    axios.post('/api/addNotice', {'groupId': groupId, 'content': content})
      .then(function(response){
        if(response.status===200){
          alert("添加通知完成");
          setIsOpen(false);
          setContent('');
          dispatchFullGroupInfo();
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
        <DialogTitle>输入群通知</DialogTitle>
        <DialogContent>
          <TextField
            value={content} 
            onKeyDown={handleKeyDown}
            onChange={e=>{setContent(e.target.value)}}
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

export default AddNotice;
