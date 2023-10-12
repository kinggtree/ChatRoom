import React, { useEffect, useState } from "react";
import './styles.css';
import axios from "axios";
import { List, ListItemText, ListItem, IconButton, ListItemAvatar, Avatar } from "@mui/material";

function ContactsItem(item){
    const [friendInfo, setFriendInfo]=useState({});
    const [picPath, setPicPath]=useState('');


    useEffect(()=>{
        setFriendInfo(item);
        axios.get('/api/profilePictureURL', item.contactId)
            .then((response)=>{
                setPicPath(response.data);
            }).catch((err)=>{
            console.log(err);
            });
    },[]);

    const removeFriend=function(){
        axios.post('/api/unfriend', friendInfo)
        .then(()=>{
            alert('remove successfully!');
        }).catch((err)=>{
            console.log(err);
        });
    };

    return(
    <ListItem 
    key={item.contactId}
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
    )
}



const UserProfile = function() {
    const [personalInfo, setPersonInfo]=useState({});

    useEffect(() => {
        axios.post('/api/personalProfile')
        .then((response)=>{
            setPersonInfo(response.data);
        }).catch((err)=>{
            console.log(err);
        });
    }, []);

    return (
        <div className="user-profile">
            <img 
                src={personalInfo.profilePictureURL} 
                alt={`${personalInfo.username}'s profile`} 
                className="profile-picture" 
            />
            <h1 className="username">{personalInfo.username}</h1>
            <p className="self-intro">{personalInfo.self_intro}</p>
            <p className="gender"><strong>Gender: </strong>{personalInfo.gender}</p>
            <List component="nav" className="contacts">
                {personalInfo.contacts.map((item)=>{
                    return <ContactsItem {...item} />
                })}
            </List>
        </div>
    );
}

export default UserProfile;
