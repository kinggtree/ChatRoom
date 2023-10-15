import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, 
    ListItemText, 
    ListItem, 
    IconButton, 
    ListItemAvatar, 
    Avatar
    } from "@mui/material";
import DeleteIcon from'@mui/icons-material/Delete';



// 每个联系人的组件
function ContactsItem(item){
  const [friendInfo, setFriendInfo]=useState({});
  const [picPath, setPicPath]=useState('');


  useEffect(()=>{
    setFriendInfo(item);
    axios.post('/api/profilePictureURL', {contactId: item.contactId})
      .then((response)=>{
        setPicPath(response.data);
      }).catch((err)=>{
        console.log(err);
      });
  },[]);

  const removeFriend=function(){
      axios.post('/api/unfriend', friendInfo)
      .then(()=>{
          item.updateInfo();
          alert('remove successfully!');
      }).catch((err)=>{
          console.log(err);
      });
  };

  return(
  <ListItem 
  secondaryAction={
    <IconButton edge="end" aria-label="delete" onClick={removeFriend}>
      <DeleteIcon />
    </IconButton>
  }>
    <ListItemAvatar>
      <Avatar
        alt={'profile photo of '+item.contactUsername}
        src={picPath}
      />
    </ListItemAvatar>
    <ListItemText primary={item.contactUsername} />
  </ListItem>
  );
};



function ManageContacts({contacts, updateInfo}){
  return (
  <div>
    <List component="nav" className="contacts">
      {contacts.map((item)=>{
        return <ContactsItem key={item.contactId} updateInfo={updateInfo} {...item} />
      })}
    </List>
  </div>

  )
}

export default ManageContacts;



