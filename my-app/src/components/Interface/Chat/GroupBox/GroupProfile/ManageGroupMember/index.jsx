import React, { useCallback } from 'react';
import axios from "axios";

import DeleteIcon from'@mui/icons-material/Delete';
import { Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
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
    <div>
      <ListItem
      style={{ padding: '10px 0' }} 
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
      <Divider />
    </div>

  );
};


function ManageGroupMembers(){
  const fullGroupMembers = useSelector(state => state.fullGroupInfo.item.groupMembers);
  const groupOwnerId=useSelector(state=>state.fullGroupInfo.item.groupOwnerId);
  const userId=useSelector(state=>state.userInfo.item._id);

  const dispatch = useDispatch();
  const dispatchFullGroupInfo = useCallback(() => {
    dispatch(fetchFullGroupInfo());
  }, [dispatch]);

  
  return(
    <div>
      <List component="nav" className="contacts">
        {
          Object.keys(fullGroupMembers).map(memberId=>{
            const member=fullGroupMembers[memberId];
            return <MembersItem 
                    key={memberId} 
                    _id={memberId} 
                    name={member.name} 
                    profilePictureURL={member.profilePictureURL} 
                    dispatchFullGroupInfo={dispatchFullGroupInfo} 
                    isCreator={groupOwnerId===userId ? true : false} />
          })
        }
      </List>
    </div>
  );
};


export default ManageGroupMembers;