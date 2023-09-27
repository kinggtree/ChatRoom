import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItemButton, ListItemText } from '@mui/material';
import './styles.css';
import tempContacts from "./temp.json"

function ListButton({username, user_id}) {
  let link='/chat/'+user_id;
  return (
    <ListItemButton component={Link} to={link}>
      <ListItemText primary={username} />
    </ListItemButton>
  )
}


function Contacts() {
  const [contacts, setContacts]=useState({userlist: []});

  //get contacts list
  useEffect(()=>{
    setContacts(tempContacts); 
  }, []);   // 加上空依赖数组，这样这个effect只会在组件mount的时候执行一次

  return (
    <List component="nav" className="nav-list">
      {contacts.userlist.map((item)=><ListButton key={item.user_id} {...item} className="nav-list-item" />)}
    </List>
  )
}

export default Contacts;