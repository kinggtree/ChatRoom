import React, { useEffect, useState } from "react";
import './styles.css';
import axios from "axios";
import { List, ListItemText, ListItem, IconButton, ListItemAvatar, Avatar, CircularProgress } from "@mui/material";

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
    )
}



const UserProfile = function({updateInfo}) {
    const [personalInfo, setPersonInfo]=useState({});
    const[loading, setLoading]=useState(true);


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