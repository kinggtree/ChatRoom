import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListItemAvatar, Avatar, ListItemButton, ListItemText, Badge } from '@mui/material';
import './styles.css';

import { useDispatch, useSelector } from 'react-redux';
import { messageRead } from '../../../../../reduxSlice/unreadContactSlice';
import axios from 'axios';


function GroupItem({_id, groupName, groupProfilePictureURL }) {
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
            alt={'profile photo of '+groupName}
            src={groupProfilePictureURL}
          />
        </Badge>
      </ListItemAvatar>
      <ListItemText primary={groupName} />
    </ListItemButton>
  )
}

export default GroupItem;
