import { Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import { useSelector } from "react-redux";
import './styles.css'

function FriendProfile(){
  const [isLoading, setIsLoading]=useState(true);
  const [like, setLike]=useState(0);

  const friendInfo=useSelector(state=>state.friendInfo.item);

  useEffect(()=>{
    setLike(friendInfo.like);
    setIsLoading(false);
  },[friendInfo]);

  if(isLoading){
    return (<CircularProgress />)
  }

  const handleLike=()=>{
    setLike(like+1);
    axios.post('/api/like', {_id: friendInfo._id})
      .catch((err)=>console.log(err));
  }

  return(
    <div className="friend-profile">
      <img 
          src={friendInfo.profilePictureURL} 
          alt={`${friendInfo.username}'s profile`} 
          className="profile-picture" 
      />
      <Button onClick={handleLike} >
        <ThumbUpIcon />
        <p>{like}</p>
      </Button>
      <Typography variant="h4" className="friend-name">{friendInfo.username}</Typography>
      <Typography className="friend-intro">自我介绍: {friendInfo.self_intro}</Typography>
      <Typography className="friend-gender">性别: {friendInfo.gender}</Typography>
    </div>
  )
}

export default FriendProfile;