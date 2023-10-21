import React, { useState } from "react";
import axios from "axios";
import {
    Button, 
    TextField, 
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem} from "@mui/material";
import './styles.css'
import { fetchUserInfo } from "../../../../reduxActions/userInfoActions";
import { fetchPersonalInfo } from "../../../../reduxActions/personalInfoActions";
import { useDispatch } from "react-redux";

// 更改自我介绍组件
function EditInfo() {
  const [newIntro, setNewIntro]=useState('');
  const [newUsername, setNewUsername]=useState('');
  const [gender, setGender]=useState('');
  const dispatch=useDispatch();

  const handleSubmit=function(e){
    e.preventDefault();

    if(newIntro==='')
      setNewIntro('');      // 设置这里为之前的个人介绍

    axios.post('/api/changeIntro', {newUsername: newUsername, newIntro: newIntro, gender: gender})
      .then(()=>{
        alert('修改成功！');
        dispatch(fetchUserInfo());
        dispatch(fetchPersonalInfo());
      }).catch((err)=>{
        alert('cannot change!');
        console.log(err);
      });
  };

  return(
    <div>
      <List>
      <ListItem className="self-intro">
        <Typography>修改用户名</Typography>
        <TextField
          value={newUsername} 
          onChange={e=>{setNewUsername(e.target.value)}} 
          label='用户名'
        />
      </ListItem>
      <ListItem className="self-intro">
        <Typography>修改自我介绍</Typography>
        <TextField
          value={newIntro} 
          onChange={e=>{setNewIntro(e.target.value)}} 
          label='自我介绍'
        />
      </ListItem>

      <ListItem className="gender">
        <Typography>修改性别</Typography>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="gender-select-label">请选择</InputLabel>
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
      </ListItem>

      <ListItem className="editButtonItem">
        <Button variant="contained" onClick={handleSubmit} className="editButton">
          修改
        </Button>
      </ListItem>

      </List>

    </div>
  );
}

export default EditInfo;
