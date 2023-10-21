import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, 
    ListItemText, 
    ListItem, 
    IconButton, 
    ListItemAvatar, 
    Avatar,
    Typography,
    Toolbar,
    CircularProgress
    } from "@mui/material";
import DeleteIcon from'@mui/icons-material/Delete';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import './styles.css'
import { useSelector } from "react-redux";


// 每个联系人的组件
function ContactsItem(item){
  const [friendInfo, setFriendInfo]=useState({});
  const [isLoading, setIsLoading]=useState(true);


  useEffect(()=>{
    axios.post('/api/getFriendBoxInfo', {friendId: item.contactId})
    .then((response)=>{
      setFriendInfo(response.data);
      setIsLoading(false);
    }).catch((err)=>{
      console.log(err);
    });
  },[]);

  const removeFriend=function(){
    axios.post('/api/unfriend', {friendId: friendInfo._id})
    .then(()=>{
        alert('remove successfully!');
    }).catch((err)=>{
        console.log(err);
    });

  };

  if(isLoading){
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return(
  <ListItem 
  secondaryAction={
    <IconButton edge="end" aria-label="delete" onClick={removeFriend}>
      <DeleteIcon />
    </IconButton>
  }>
    <ListItemAvatar>
      <Avatar
        alt={'profile photo of '+friendInfo.username}
        src={friendInfo.profilePictureURL}
      />
    </ListItemAvatar>
    <ListItemText primary={friendInfo.username} />
  </ListItem>
  );
};



function ManageContacts(){
  const [isSort, setIsSort]=useState(false);
  const [isLoading, setIsLoading]=useState(true);
  const [originalContact, setOriginalContact]=useState([]);
  const [orderedContact, setOrderedContact]=useState([]);
  const [usingContact, setUsingContact]=useState([]);

  const contacts=useSelector(state=>state.userInfo.item.contacts);

  const sortContact=(newContacts)=>{
    const sortedContacts = newContacts.slice().sort((a, b) => {
      if (a.contactUsername < b.contactUsername) {
        return -1;
      } else if (a.contactUsername > b.contactUsername) {
        return 1;
      } else {
        return 0;
      }
    });
    
    setOrderedContact(sortedContacts);
  }

  const initContact=async ()=>{
    try{
      const promises = contacts.map(async (item)=>{
        const response = await axios.post('/api/getFriendName', { friendId: item.contactId });
        return {
          'contactUsername': response.data,
          'contactId': item.contactId
        };
      });

      const results=await Promise.all(promises);

      setOriginalContact(results);

      setUsingContact(results);

      sortContact(results);

      setIsLoading(false);
      
      } catch(err) {
      console.log(err);
    }
  }


// 专门处理初始化加载
useEffect(() => {
  if (isLoading) {
    initContact();
  }
}, [isLoading]);

// 处理排序状态的变化
useEffect(() => {
  if (isSort) {
    setUsingContact(orderedContact);
  } else {
    setUsingContact(originalContact);
  }
}, [isSort]);



  const changeSort=()=>{
    setIsSort(!isSort);
  }

  if(isLoading){
    return <CircularProgress />
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
      {usingContact.map((item)=>{
        return <ContactsItem key={item.contactId} {...item} />
      })}
    </List>
  </div>

  )
}

export default ManageContacts;



