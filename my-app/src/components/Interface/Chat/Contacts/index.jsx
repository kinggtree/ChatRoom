import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItemAvatar, Avatar, ListItemButton, ListItemText, CircularProgress, Badge } from '@mui/material';
import './styles.css';

import { useDispatch, useSelector } from 'react-redux';
import { messageRead } from '../../../../reduxSlice/unreadContactSlice';


function ListButton({_id, username, profilePictureURL, unreadNum }) {
  const contactId=_id;
  let link=contactId;

  console.log(useSelector(state=>state.unreadContact));

  const isUnread = unreadNum && unreadNum > 0; // 如果unreadNum存在且大于0，则为true，否则为false
  const dispatch=useDispatch();


  return (
    <ListItemButton component={Link} to={link} onClick={()=>dispatch(messageRead(contactId))}>
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
  const unreadContact=useSelector(state=>state.unreadContact);
  const contactStatus=useSelector(state=>state.fullContact.status);

  if(contactStatus!=='succeeded'){
    return <CircularProgress />
  }

  return (
    <List component="nav" className="nav-list">
      {fullContact.map((item)=>{
        return <ListButton key={item._id} {...item} unreadNum={unreadContact[item._id]} className="nav-list-item" />
      })}
    </List>
  )
}

export default Contacts;