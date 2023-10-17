import { Button, MenuItem, Select, TextField, InputLabel, FormControl, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function SignUp(){
  const [username, setUsername]=useState('');
  const [password, setPassword]=useState('');
  const [pw_sec, setPw_sec]=useState('');
  const [gender, setGender]=useState('');
  const [key, setKey]=useState('');
  const [err, setErr]=useState(false);
  const navigate=useNavigate();

  const handleSubmit=function(e){
    e.preventDefault();
    if(password!==pw_sec){
      setErr(true);
      return;
    }
    const newUser={
      newUsername: username,
      newPassword: password,
      gender: gender,
      key: key
    }
    axios.post('/api/signup', newUser)
      .then(response=>{
        if(response.status===200){
          alert("成功注册！");
          navigate('/');
        } else {
          alert(response.data);
        }
      }).catch(err=>{
        alert(err.response.data);
      });
  };

  return(
    <form className="sign-up">
      <TextField 
        required 
        value={username} 
        label="请输入用户名" 
        onChange={e=>setUsername(e.target.value)}
      />
      <TextField 
       required 
       error={err} 
       label="请输入密码" 
       type='password' 
       value={password}
       onChange={e=>setPassword(e.target.value)}
      />
      <TextField
      required 
      error={err} 
      label="请再次输入密码" 
      type="password" 
      value={pw_sec} 
      onChange={e=>setPw_sec(e.target.value)}
      />
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="gender-select-label">请选择性别</InputLabel>
        <Select
          labelId="gender-select" 
          value={gender} 
          label="Gender" 
          onChange={e=>setGender(e.target.value)}
        >
          <MenuItem value={'male'}>男</MenuItem>
          <MenuItem value={'female'}>女</MenuItem>
          <MenuItem value={'gun-ship'}>武装直升机</MenuItem>
        </Select>
      </FormControl>
      <TextField 
       required 
       error={err} 
       label="密钥" 
       type='text' 
       value={key}
       onChange={e=>setKey(e.target.value)}
      />
      <Typography>
        密钥请询问管理员
      </Typography>
      <Button variant='contained' onClick={handleSubmit}>
        注册
      </Button>

    </form>
  )
}

export default SignUp;