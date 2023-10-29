import { CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import './styles.css';

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
      <img
        src={fullGroupInfo.groupProfilePictureURL || "default-profile-picture-url"}
        alt={`${fullGroupInfo.groupName}'s profile picture`}
        className="profile-picture"
      />
      <Typography variant="h4" className="group-name">{fullGroupInfo.groupName}</Typography>
      <Typography className="group-intro">群介绍: {fullGroupInfo.group_intro || "暂无介绍"}</Typography>
      <Typography className="group-notice-title">群通知:</Typography>
      <ul className="group-notices">
        {fullGroupInfo.group_notice.length > 0 ? (
          fullGroupInfo.group_notice.map((notice, index) => (
            <li key={index} className="group-notice">{notice.content}</li>
          ))
        ) : (
          <Typography className="no-notice">暂无通知</Typography>
        )}
      </ul>
      <Typography className="group-members-title">群成员:</Typography>
      <ul className="group-members">
        {fullGroupInfo.groupMembers.map(member => (
          <li key={member.userId} className="group-member">{member.userId || "匿名用户"}</li>
        ))}
      </ul>
    </div>
  );
}

export default GroupProfile;
