import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItemAvatar, Avatar, ListItemButton, ListItemText } from '@mui/material';
import './styles.css';
import axios from 'axios';

function ListButton(item) {
  let link='/chat/'+item.contactId;
  const [picPath, setPicPath]=useState('');

  useEffect(()=>{
    axios.get('/api/profilePictureURL', item.contactId)
     .then((response)=>{
        setPicPath(response.data);
     }).catch((err)=>{
      console.log(err);
     });
  }, []);

  return (
    <ListItemButton component={Link} to={link}>
      <ListItemAvatar>
        <Avatar
          alt={'profile photo of '+item.contactUsername}
          src={picPath}
        />
      </ListItemAvatar>
      <ListItemText primary={item.contactUsername} />
    </ListItemButton>
  )
}

// 传入的是userInfo，从中获得contacts
function Contacts(userInfo) {
  const [contacts, setContacts]=useState([]);

  //get contacts list
  useEffect(()=>{
    setContacts(userInfo.contacts); 
  }, []);

  return (
    <List component="nav" className="nav-list">
      {contacts.map((item)=>{
        return <ListButton key={item.contactId} {...item} className="nav-list-item" />
      })}
    </List>
  )
}

export default Contacts;