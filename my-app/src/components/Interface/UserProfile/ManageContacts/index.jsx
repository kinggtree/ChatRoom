import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, 
    ListItemText, 
    ListItem, 
    IconButton, 
    ListItemAvatar, 
    Avatar,
    Typography,
    Toolbar
    } from "@mui/material";
import DeleteIcon from'@mui/icons-material/Delete';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import './styles.css'


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
  const [currentContact, setCurrentContact]=useState([]);
  const [isSort, setIsSort]=useState(false);

  const sortContact=()=>{
    const sortedContacts = contacts.slice().sort((a, b) => {
      if (a.contactUsername < b.contactUsername) {
        return -1;
      } else if (a.contactUsername > b.contactUsername) {
        return 1;
      } else {
        return 0;
      }
    });
    
    return sortedContacts;
  }


  useEffect(()=>{
    if(isSort){
      setCurrentContact(sortContact);
    } else {
      setCurrentContact(contacts);
    };
  },[isSort]);


  const changeSort=()=>{
    setIsSort(!isSort);
  }


  return (
  <div>
    <Toolbar className="contact-toolbar">
      <Typography>按字母排序</Typography>
      <IconButton aria-label="sort" onClick={changeSort}>
        <SortByAlphaIcon />
      </IconButton>
    </Toolbar>
    <List component="nav" className="contacts">
      {currentContact.map((item)=>{
        return <ContactsItem key={item.contactId} updateInfo={updateInfo} {...item} />
      })}
    </List>
  </div>

  )
}

export default ManageContacts;



