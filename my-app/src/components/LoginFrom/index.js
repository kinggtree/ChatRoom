import React, {useState} from 'react';
import Input from '../Input';
import Button from '../Button';
import './LoginForm.css';

const LoginForm=()=>{
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');

    const handleSubmit=(e)=>{
        e.preventDefault();
        //调用API，将username和password发送到服务器进行验证
        console.log('Logging in with username: ${username} and password: ${password}');
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e=>setUsername(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
            />
            <Button type="submit">
                Log in
            </Button>
        </form>
    );
};

export default LoginForm