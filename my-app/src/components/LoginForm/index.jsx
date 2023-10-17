import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material';
import './styles.css';
import axios from 'axios';

function LoginForm() {
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();

    const handleSubmit=(e)=>{

        let jsonObj={
            'username': username,
            'password': password
        };
        axios.post('/api/login', jsonObj)
        .then(response=>{
            if(response.status===200){
                alert("登录成功!");
                navigate('/interface/chat');
            } else {
                alert(response.data);
                setPassword('');
                setUsername('');
            };
        }).catch(err=>{
            alert("无法登录： "+err.response.data);
        });
        //调用API，将username和password发送到服务器进行验证
    };

    const toSignUp=(e)=>{
        e.preventDefault();
        navigate('/sign-up');
    };

    const handleKeyDown=(e)=>{
        if(e.key==='Enter'){
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <form className="login-form">
            <TextField
                required
                label="用户名"
                value={username}
                onChange={e=>setUsername(e.target.value)}
            />
            <TextField
                required
                label="密码"
                type="password"
                value={password}
                onKeyDown={handleKeyDown}
                onChange={e=>setPassword(e.target.value)}
            />
            <Button variant="contained" onClick={handleSubmit} className='login'>
                登录
            </Button>
            <Button variant='outlined' onClick={toSignUp} className='signup'>
                注册
            </Button>
        </form>
    );
};

export default LoginForm