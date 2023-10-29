import React from 'react';
import { List, CircularProgress, ListItem } from '@mui/material';
import './styles.css';

import { useSelector } from 'react-redux';

import PersonItem from './PersonItem';
import GroupItem from './GroupItem';




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