import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material';
import './LoginForm.css';
import axios from 'axios';

function LoginForm() {
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();

    const handleSubmit=(e)=>{
        e.preventDefault();
        let jsonObj={
            'username': username,
            'password': password
        };
        axios.post('/api/login', jsonObj)
        .then(response=>{
            if(response.status===200){
                alert("Login successsfully!");
                navigate('/chat');
            } else {
                alert(response.data);
                setPassword('');
                setUsername('');
            }
        }).catch(err=>{
            alert("Failed to log in due to "+err.response.data);
        });
        //调用API，将username和password发送到服务器进行验证
    };

    const toSignUp=(e)=>{
        e.preventDefault();
        navigate('/sign-up');
    }

    return (
        <form className="login-form">
            <TextField
                required
                label="User"
                value={username}
                onChange={e=>setUsername(e.target.value)}
            />
            <TextField
                required
                label="Password"
                type="password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
            />
            <Button variant="contained" onClick={handleSubmit}>
                Log in
            </Button>
            <Button variant='outlined' onClick={toSignUp}>
                Sign Up
            </Button>
        </form>
    );
};

export default LoginForm