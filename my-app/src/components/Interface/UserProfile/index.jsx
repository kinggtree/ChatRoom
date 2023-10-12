import React, { useEffect, useState } from "react";
import './styles.css';
import axios from "axios";
import { List, 
    ListItemText, 
    ListItem, 
    IconButton, 
    ListItemAvatar, 
    Avatar, 
    CircularProgress, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle,
    TextField } from "@mui/material";

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
            <p>Delete</p>
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

// 更改自我介绍组件
function ChangeIntro() {
    const [newIntro, setNewIntro]=useState('');
    const[open, setOpen]=useState(false);
  
    const handleSubmit=function(e){
      e.preventDefault();
      axios.post('/api/changeIntro', {newIntro: newIntro})
            .then(()=>{
                alert('finish edit!');
                setOpen(false);
            }).catch((err)=>{
                alert('cannot change!');
                console.log(err);
            });
    };
  
    const handleClick = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    return(
      <div>
        <Button variant='outlined' onClick={handleClick}>Change</Button>
        <Dialog
        open={open} 
        aria-labelledby="alert-dialog-title" 
        aria-describedby="alert-dialog-description"
        >
          <DialogTitle>输入新的自我介绍</DialogTitle>
          <DialogContent>
            <TextField
              value={newIntro} 
              onChange={e=>{setNewIntro(e.target.value)}}
              label='New Introduction'
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleSubmit}>
              Edit
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
      </Dialog>
      </div>
    );
  }


// 用户档案总界面
const UserProfile = function({updateInfo}) {
    const [personalInfo, setPersonInfo]=useState({});
    const [loading, setLoading]=useState(true);


    useEffect(() => {
        axios.post('/api/personalProfile')
        .then((response)=>{
            setPersonInfo(response.data);
            setLoading(false);
        }).catch((err)=>{
            console.log(err);
        });
    }, []);


    if(loading) {
        return <CircularProgress />
    }


    return (
        <div className="user-profile">
            <img 
                src={personalInfo.profilePictureURL} 
                alt={`${personalInfo.username}'s profile`} 
                className="profile-picture" 
            />
            <h1 className="username">{personalInfo.username}</h1>
            <p className="self-intro">{personalInfo.self_intro}</p>
            <ChangeIntro />
            <p className="gender"><strong>Gender: </strong>{personalInfo.gender}</p>
            <List component="nav" className="contacts">
                {personalInfo.contacts.map((item)=>{
                    return <ContactsItem key={item.contactId} updateInfo={updateInfo} {...item} />
                })}
            </List>
        </div>
    );
}

export default UserProfile;