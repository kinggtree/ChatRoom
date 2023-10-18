import { Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import './styles.css'

function FriendProfile({componentInfo}){
  const [friendProfile, setFriendProfile]=useState();
  const [isLoading, setIsLoading]=useState(true);
  const [like, setLike]=useState(0);

  useEffect(()=>{
    setLike(componentInfo.friendInfo.like);
    setFriendProfile(componentInfo.friendInfo)
    setIsLoading(false);
  },[]);

  if(isLoading){
    return (<CircularProgress />)
  }

  const handleLike=()=>{
    setLike(like+1);
    axios.post('/api/like', {_id: componentInfo.friendInfo._id})
      .catch((err)=>console.log(err));
  }

  return(
    <div className="friend-profile">
      <img 
          src={friendProfile.profilePictureURL} 
          alt={`${friendProfile.username}'s profile`} 
          className="profile-picture" 
      />
      <Button onClick={handleLike} >
        <ThumbUpIcon />
        <p>{like}</p>
      </Button>
      <Typography variant="h4" className="friend-name">{friendProfile.username}</Typography>
      <Typography className="friend-intro">自我介绍: {friendProfile.self_intro}</Typography>
      <Typography className="friend-gender">性别: {friendProfile.gender}</Typography>
    </div>
  )
}

export default FriendProfile;