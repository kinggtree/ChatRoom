import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItemButton, ListItemText } from '@mui/material';
import './styles.css';

function ListButton({name}) {
  let link='/chat/'+name;
  return (
    <ListItemButton component={Link} to={link}>
      <ListItemText primary={name} />
    </ListItemButton>
  )
}


function Contacts(userInfo) {
  const [contacts, setContacts]=useState([]);

  //get contacts list
  useEffect(()=>{
    setContacts(userInfo.contacts); 
  }, [userInfo.contacts]);  //依赖数组中添加了userInfo.contacts，以确保在userInfo.contacts更改时重新获取联系人

  return (
    <List component="nav" className="nav-list">
      {contacts.map((name)=><ListButton key={name} name={name} className="nav-list-item" />)}
    </List>
  )
}

export default Contacts;