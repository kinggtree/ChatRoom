import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import './styles.css'

function EditPwd(){
  const [originalPassword, setOriginalPassword]=useState('');
  const [newPassword, setNewPassword]=useState('');
  const [pwSec, setPwSec]=useState('');
  const [err, setErr]=useState(false);


  const handleSubmit=()=>{
    if(newPassword!==pwSec){
      setErr(err);
      alert("密码不一致");
      return;
    }

    const passwordSet={
      originalPassword: originalPassword,
      newPassword: newPassword,
    }
    
    axios.post('/api/changePassword', passwordSet)
      .then(()=>{
        alert('修改密码成功！');
        setOriginalPassword('');
        setNewPassword('');
        setPwSec('');
        setErr(false);
      }).catch((error)=>{
        alert(error.response.data);
        setErr(true);
      });
  }

  return (
    <form className="change-password-form">
      <TextField 
       required 
       error={err} 
       label="旧密码" 
       type='password' 
       value={originalPassword}
       onChange={e=>setOriginalPassword(e.target.value)}
       sx={{ 
        margin: '10px 0',
        width: '80%',
      }}
      />
      <TextField 
       required 
       error={err} 
       label="新密码" 
       type='password' 
       value={newPassword}
       onChange={e=>setNewPassword(e.target.value)}
       sx={{ 
        margin: '10px 0',
        width: '80%',
      }}
      />
      <TextField
      required 
      error={err} 
      label="再次输入新密码" 
      type="password" 
      value={pwSec} 
      onChange={e=>setPwSec(e.target.value)}
      sx={{ 
        margin: '10px 0',
        width: '80%',
      }}
      />
      <Button variant="contained" onClick={handleSubmit}>重置</Button>
    </form>
  )
}


export default EditPwd;