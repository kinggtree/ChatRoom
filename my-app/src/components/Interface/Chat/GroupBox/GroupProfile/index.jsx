import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { CircularProgress, Typography, TextField, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import './styles.css';
import ManageGroupMembers from "./ManageGroupMember";
import ManageNotice from "./ManageNotice";
import AvatarUploader from "../../../AvatarUploader";

function GroupProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [intro, setIntro] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const fullGroupInfo = useSelector(state => state.fullGroupInfo.item);
  const userId=useSelector(state=>state.userInfo.item._id);
  const isCreator=fullGroupInfo.groupOwnerId===userId ? true : false;

  useEffect(() => {
    if (fullGroupInfo) {
      setIsLoading(false);
      setIntro(fullGroupInfo.groupIntro || '');
    }
  }, [fullGroupInfo]);

  const handleIntroChange = (event) => {
    setIntro(event.target.value);
  };

  const updateGroupIntro = () => {
    axios.post('/api/updateGroupIntro', {'newIntro': intro, 'groupId': fullGroupInfo._id})
      .then(() => {
        alert('成功更新群组介绍');
        setIsEdit(false);
      }).catch(err => {
        console.log(err);
        alert("更新失败...");
      });
  };

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

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
        src={fullGroupInfo.groupProfilePictureURL}
        alt={`${fullGroupInfo.groupName}`}
        className="group-profile-picture"
      />
      
      {isCreator ? 
      <AvatarUploader
        type={'group'}
        _id={fullGroupInfo._id}
      /> : null }

      <Typography variant="h4" className="group-name">{fullGroupInfo.groupName}</Typography>
      {isEdit&&isCreator ? (
        <div className="intro-textfield-container">
          <TextField
            label="请输入新的群组介绍"
            variant="outlined"
            value={intro}
            onChange={handleIntroChange}
            className="intro-textfield"
          />
          <Button onClick={updateGroupIntro} className="save-button">
            <SaveIcon />
          </Button>
          <Button onClick={toggleEdit} className="cancel-button">
            <CancelIcon />
          </Button>
        </div>
      ) : (
        <div className="group-intro-container">
          <Typography className="group-intro">
            群介绍: {intro || "暂无介绍"}
          </Typography>
          {isCreator ? (
          <Button onClick={toggleEdit} className="edit-button">
            <EditIcon />
          </Button>) : null}
        </div>
      )}
      <Typography className="group-notice-title">群通知:</Typography>
      <ManageNotice isCreator={isCreator} />
      <Typography className="group-members-title">群成员:</Typography>
      <ManageGroupMembers isCreator={isCreator} />
    </div>
  );
}

export default GroupProfile;
