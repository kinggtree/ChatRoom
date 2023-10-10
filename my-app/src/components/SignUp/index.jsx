import { Button, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function SignUp(){
  const [username, setUsername]=useState();
  const [password, setPassword]=useState();
  const [pw_sec, setPw_sec]=useState();
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
      newPassword: password
    }
    axios.post('/api/signup', newUser)
      .then(response=>{
        if(response.status===200){
          alert("Sign up successfully!");
          navigate('/');
        } else {
          alert(response.data);
        }
      }).catch(err=>{
        alert(err.response.data);
      });
  }

  return(
    <form className="sign-up">
      <TextField 
        required 
        value={username} 
        label="User Name" 
        onChange={e=>setUsername(e.target.value)}
      />
      <TextField 
       required 
       error={err} 
       label="Password" 
       type='password' 
       value={password}
       onChange={e=>setPassword(e.target.value)}
      />
      <TextField
      required 
      error={err} 
      label="Type password again" 
      type="password" 
      value={pw_sec} 
      onChange={e=>setPw_sec(e.target.value)}
    />
      <Button variant='contained' onClick={handleSubmit}>
        Sign Up
      </Button>

    </form>
  )
}

export default SignUp;