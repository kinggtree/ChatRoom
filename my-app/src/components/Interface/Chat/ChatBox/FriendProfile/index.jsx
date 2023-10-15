import { CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import './styles.css'

function FriendProfile({componentInfo}){
  const [friendProfile, setFriendProfile]=useState();
  const [isLoading, setIsLoading]=useState(true);

  useEffect(()=>{
    console.log(componentInfo.friendInfo);
    setFriendProfile(componentInfo.friendInfo)
    console.log(friendProfile);
    setIsLoading(false);
  },[]);

  if(isLoading){
    return (<CircularProgress />)
  }

  return(
    <div className="friend-profile">
      <img 
          src={friendProfile.profilePictureURL} 
          alt={`${friendProfile.username}'s profile`} 
          className="profile-picture" 
      />
      <Typography variant="h4">{friendProfile.username}</Typography>
      <Typography>{friendProfile.self_intro}</Typography>
      <Typography>{friendProfile.gender}</Typography>
    </div>
  )
}

export default FriendProfile;