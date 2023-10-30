import React, { useCallback } from 'react';
import axios from "axios";
import './styles.css';

import DeleteIcon from'@mui/icons-material/Delete';
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFullGroupInfo } from '../../../../../../reduxActions/fullGroupInfoActions';


function MembersItem({_id, name, profilePictureURL, dispatchFullGroupInfo, isCreator}){

  const removeMembers=function(){
    if(isCreator){
      axios.post('/api/removeGroupMembers', {'memberId': _id})
      .then(()=>{
        alert("成功删除");
        dispatchFullGroupInfo();
      }).catch(()=>{
        alert("出现了点问题...");
      });
    };
  };

  return(
    <ListItem
    className='manage-group-contact'
    style={{'width': 'auto'}}
    secondaryAction={
      isCreator ? (
        <IconButton edge='end' aria-label='delete' onClick={removeMembers}>
          <DeleteIcon />
        </IconButton>
      ) : null
    }>
      <ListItemAvatar>
        <Avatar
          alt={'profile photo of '+name}
          src={profilePictureURL}
        />
      </ListItemAvatar>
      <ListItemText primary={name} />
    </ListItem>
  );
};


function ManageGroupMembers({isCreator}){
  const fullGroupMembers = useSelector(state => state.fullGroupInfo.item.groupMembers);

  const dispatch = useDispatch();
  const dispatchFullGroupInfo = useCallback(() => {
    dispatch(fetchFullGroupInfo());
  }, [dispatch]);

  
  return(
    <div>
      <List component="nav" className="manage-group-contacts">
        {
          Object.keys(fullGroupMembers).map(memberId=>{
            const member=fullGroupMembers[memberId];
            return <MembersItem 
                    key={memberId} 
                    _id={memberId} 
                    name={member.name} 
                    profilePictureURL={member.profilePictureURL} 
                    dispatchFullGroupInfo={dispatchFullGroupInfo} 
                    isCreator={isCreator} />
          })
        }
      </List>
    </div>
  );
};


export default ManageGroupMembers;