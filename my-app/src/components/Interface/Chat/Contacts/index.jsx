import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItemAvatar, Avatar, ListItemButton, ListItemText, CircularProgress, Badge, ListItem } from '@mui/material';
import './styles.css';

import { useDispatch, useSelector } from 'react-redux';
import { messageRead } from '../../../../reduxSlice/unreadContactSlice';
import axios from 'axios';

import PersonItem from './PersonItem';
import GroupItem from './GroupItem';


function ListButton({_id, username, profilePictureURL }) {
  const contactId=_id;
  let link=contactId;

  const unreadObj=useSelector(state=>state.unreadContact[contactId]);

  const [isUnread, setIsUnread]=useState(false);
  const dispatch=useDispatch();

  useEffect(()=>{
    setIsUnread(unreadObj.unreadCount>0);
  }, [unreadObj]);


  // 处理已读逻辑
  const handleClick=()=>{
    if(isUnread){
      dispatch(messageRead({
        senderId: contactId
      }));
      setIsUnread(false);
      axios.post('/api/setIsRead', {messageIds: unreadObj.messageIds});
    }
  }

  return (
    <ListItemButton component={Link} to={link} onClick={handleClick}>
      <ListItemAvatar>
        <Badge
          color="error"
          badgeContent={unreadObj.unreadCount > 0 ? unreadObj.unreadCount : null} // 如果unreadNum大于0，则显示数量，否则不显示
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
  const contactStatus=useSelector(state=>state.fullContact.status);

  const groupInfo=useSelector(state=>state.groupInfo.item);

  if(contactStatus!=='succeeded'){
    return <CircularProgress />
  }

  return (
    <div>
      {fullContact.length ? <List component="nav" className="nav-list">
        {fullContact.map((item)=>{
          return <PersonItem key={item._id} {...item} className="nav-list-item" />
        })}
      </List> : <List>
        <ListItem className='nav-list-item'>添加一些好友吧！</ListItem>
      </List>}
      
      {groupInfo.length ? 
      <List component="nav" className="nav-list">
        {groupInfo.map(group=>{
          return <GroupItem key={group._id} {...group} className="nav-list-item" />
        })}
      </List> : <List>
        <ListItem className='nav-list-item'>加入一些群吧！</ListItem>
      </List>}
      
    </div>
  )
}

export default Contacts;