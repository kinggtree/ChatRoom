import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItemAvatar, Avatar, ListItemButton, ListItemText, CircularProgress, Badge } from '@mui/material';
import './styles.css';

import { useSelector } from 'react-redux';


function ListButton({_id, username, profilePictureURL, isNewMessage }) {
  const contactId=_id;
  let link=contactId;


  const [isLoading, setIsLoading]=useState(true);
  const [isUnread, setIsUnread]=useState(false);


  useEffect(()=>{
    setIsUnread(isNewMessage);
    setIsLoading(false);
  }, []);



  if(isLoading){
    return(
    <div>
      <CircularProgress />
    </div>
    );
  }


  return (
    <ListItemButton component={Link} to={link} onClick={e=>setIsUnread(false)}>
      <ListItemAvatar>
        <Badge
        color="error"
        variant="dot"
        overlap="circular"
        invisible={!isUnread}
        >
          <Avatar
            alt={'profile photo of '+username}
            src={profilePictureURL}
          />
        </Badge>
      </ListItemAvatar>
      <ListItemText primary={username} />
    </ListItemButton>
  )
}


function Contacts() {
  const fullContact=useSelector(state=>state.fullContact.item);


  return (
    <List component="nav" className="nav-list">
      {fullContact.map((item)=>{
        return <ListButton key={item._id} {...item} className="nav-list-item" />
      })}
    </List>
  )
}

export default Contacts;