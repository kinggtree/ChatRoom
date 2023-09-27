import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material';
import './LoginForm.css';

function LoginForm() {
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();

    const handleSubmit=(e)=>{
        e.preventDefault();
        //调用API，将username和password发送到服务器进行验证
        console.log('Logging in with username: ', username, ' and password: ', password);
        navigate('/chat');
    };

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
        </form>
    );
};

export default LoginForm