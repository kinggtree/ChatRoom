import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItemAvatar, Avatar, ListItemButton, ListItemText, CircularProgress, Badge } from '@mui/material';
import {  useSelector } from 'react-redux';
import './styles.css';
import axios from 'axios';

function ListButton({contactId, userId}) {
  let link=contactId;

  const [friendInfo, setFriendInfo]=useState('');
  const [isLoading, setIsLoading]=useState(true);
  const [isUnread, setIsUnread]=useState(false);


  const initItem=async ()=>{
    try{
      const [friendInfoResponse, unreadResponse]=await Promise.all([
        axios.post('/api/getFriendBoxInfo',{friendId: contactId}),
        axios.post('/api/getUnread', {
          receiverId: userId,
          senderId: contactId
        })
      ]);

      if(unreadResponse.data.unread===undefined) {
        setIsUnread(false);
      } else {
        setIsUnread(unreadResponse.data.unread);
      }

      setFriendInfo(friendInfoResponse.data);
      setIsLoading(false);
    } catch (err){
      console.log(err);
    }
  };


  useEffect(()=>{
    initItem();
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
            alt={'profile photo of '+friendInfo.username}
            src={friendInfo.profilePictureURL}
          />
        </Badge>
      </ListItemAvatar>
      <ListItemText primary={friendInfo.username} />
    </ListItemButton>
  )
}

// 传入的是userInfo，从中获得contacts
function Contacts() {
  const userInfo=useSelector(state=>state.userInfo.item);

  return (
    <List component="nav" className="nav-list">
      {userInfo.contacts.map((item)=>{
        return <ListButton key={item.contactId} {...item} userId={userInfo._id} className="nav-list-item" />
      })}
    </List>
  )
}

export default Contacts;