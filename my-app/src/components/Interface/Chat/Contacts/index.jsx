import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItemAvatar, Avatar, ListItemButton, ListItemText, CircularProgress } from '@mui/material';
import './styles.css';
import axios from 'axios';

function ListButton(item) {
  let link=item.contactId;

  const [friendInfo, setFriendInfo]=useState('');
  const [isLoading, setIsLoading]=useState(true);

  useEffect(()=>{
    axios.post('/api/getFriendInfo', {friendId: item.contactId})
     .then((response)=>{
        setFriendInfo(response.data);
        setIsLoading(false);
     }).catch((err)=>{
      console.log(err);
     });
  }, []);

  if(isLoading){
    return(<CircularProgress />);
  }


  return (
    <ListItemButton component={Link} to={link}>
      <ListItemAvatar>
        <Avatar
          alt={'profile photo of '+friendInfo.username}
          src={friendInfo.profilePictureURL}
        />
      </ListItemAvatar>
      <ListItemText primary={friendInfo.username} />
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