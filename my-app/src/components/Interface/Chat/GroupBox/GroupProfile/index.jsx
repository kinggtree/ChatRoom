import { CircularProgress, Typography, Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import './styles.css';
import ManageGroupMembers from "./ManageGroupMember";
import ManageNotice from "./ManageNotice";

function GroupProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const fullGroupInfo = useSelector(state => state.fullGroupInfo.item);

  useEffect(() => {
    if (fullGroupInfo) {
      setIsLoading(false);
    }
  }, [fullGroupInfo]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="group-profile">
      <Avatar
        src={fullGroupInfo.groupProfilePictureURL}
        alt={`${fullGroupInfo.groupName}'s profile picture`}
        className="profile-picture"
      />
      <Typography variant="h4" className="group-name">{fullGroupInfo.groupName}</Typography>
      <Typography className="group-intro">群介绍: {fullGroupInfo.groupIntro || "暂无介绍"}</Typography>
      <Typography className="group-notice-title">群通知:</Typography>
      <ManageNotice />
      <Typography className="group-members-title">群成员:</Typography>
      <ManageGroupMembers />
    </div>
  );
}

export default GroupProfile;
