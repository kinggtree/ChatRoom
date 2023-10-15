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

// 更改自我介绍组件
function EditInfo() {
  const [newIntro, setNewIntro]=useState('');
  const [gender, setGender]=useState('');

  const handleSubmit=function(e){
    e.preventDefault();
    axios.post('/api/changeIntro', {newIntro: newIntro, gender: gender})
      .then(()=>{
        alert('finish edit!');
      }).catch((err)=>{
        alert('cannot change!');
        console.log(err);
      });
  };

  return(
    <div>
      <List>
      <ListItem className="self-intro">
        <Typography>修改自我介绍</Typography>
        <TextField
          value={newIntro} 
          onChange={e=>{setNewIntro(e.target.value)}} 
          label='New Introduction'
        />
      </ListItem>

      <ListItem className="gender">
        <Typography>修改性别</Typography>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="gender-select-label">Gender</InputLabel>
          <Select
            labelId="gender-select" 
            value={gender} 
            label="Gender" 
            onChange={e=>setGender(e.target.value)}
          >
            <MenuItem value={'male'}>Male</MenuItem>
            <MenuItem value={'female'}>Female</MenuItem>
            <MenuItem value={'gun-ship'}>Armed Helicopters</MenuItem>
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
