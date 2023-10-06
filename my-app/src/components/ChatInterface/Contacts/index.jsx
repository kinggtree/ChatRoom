import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItemButton, ListItemText } from '@mui/material';
import './styles.css';

function ListButton(item) {
  let link='/chat/'+item.contactId;
  return (
    <ListItemButton component={Link} to={link}>
      <ListItemText primary={item.contactUsername} />
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
      {contacts.map((item)=><ListButton key={item.contactId} {...item} className="nav-list-item" />)}
    </List>
  )
}

export default Contacts;