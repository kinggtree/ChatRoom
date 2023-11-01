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

import { fetchFullContact } from "../../../../reduxActions/fullContactActions";
import { fetchUserInfo } from "../../../../reduxActions/userInfoActions";
import { useDispatch, useSelector } from "react-redux";


// 每个联系人的组件
function ContactsItem({_id, username, profilePictureURL, dispatch}){

  const removeFriend=function(){
    axios.post('/api/unfriend', {friendId: _id})
    .then(()=>{
        alert('成功删除！');
        dispatch(fetchUserInfo());  // 会触发根组件的获取联系人信息
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
        alt={'profile photo of '+username}
        src={profilePictureURL}
      />
    </ListItemAvatar>
    <ListItemText primary={username} />
  </ListItem>
  );
};



function ManageContacts(){
  const [isSort, setIsSort]=useState(false);
  const [orderedContact, setOrderedContact]=useState([]);
  const [usingContact, setUsingContact]=useState([]);

  const dispatch=useDispatch();
  const contacts=useSelector(state=>state.userInfo.item.contacts);
  const fullContact=useSelector(state=>state.fullContact.item);   // 起始联系人目录
  const contactStatus=useSelector(state=>state.fullContact.status);

  const [isLoading, setIsLoading]=useState(true);


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
  };


  useEffect(()=>{
    if(contactStatus!=='succeeded'){
      dispatch(fetchFullContact(contacts));
    } else {
      setUsingContact(fullContact);   // 设置原始联系人列表（无序）
      sortContact(fullContact);     // 列表排序
      setIsLoading(false);
    }
  }, [contactStatus, contacts, dispatch, fullContact]);
  
  

  // 处理排序状态的变化
  useEffect(() => {
    if (isSort) {
      setUsingContact(orderedContact);
    } else {
      setUsingContact(fullContact);
    }
  }, [isSort, fullContact, orderedContact]);


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
        return <ContactsItem key={item._id} dispatch={dispatch} {...item} />
      })}
    </List>
  </div>

  )
}

export default ManageContacts;



