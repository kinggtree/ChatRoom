import React, { useEffect, useState } from "react";
import './styles.css';
import { List, 
    ListItemText, 
    CircularProgress, 
    Typography,
    ListItemButton,
} from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";
import EditInfo from "./EditInfo";
import ManageContacts from "./ManageContacts"
import EditPwd from "./EditPwd";

import { useSelector, useDispatch } from "react-redux";
import { fetchPersonalInfo } from "../../../reduxActions/personalInfoActions";

import AvatarUploader from "../AvatarUploader";


// 用户档案总界面
const UserProfile = function() {
    const [loading, setLoading]=useState(true);
    const dispatch=useDispatch();
    const personalInfo=useSelector(state=>state.personalInfo.item);
    const personalInfoStatus=useSelector(state=>state.personalInfo.status);

    // 获取个人信息
    useEffect(() => {
      dispatch(fetchPersonalInfo());
    }, [dispatch]);

    useEffect(()=>{
      if(personalInfoStatus==='succeeded'){
        setLoading(false);
      }
    }, [personalInfoStatus]);

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
      <AvatarUploader
        type={'personal'} 
        _id={personalInfo._id}
      />
      <h1 className="username">{personalInfo.username}</h1>
      <p> 点赞数: {personalInfo.like}</p>
      <Typography className="self-intro">{personalInfo.self_intro}</Typography>
      <Typography className="gender"><strong>性别: </strong>{personalInfo.gender}</Typography>

      <List component="nav" className="navigation">
        <ListItemButton component={Link} to={"editInfo"}>
          <ListItemText primary={"修改个人信息"} />
        </ListItemButton>
        <ListItemButton component={Link} to={"unfriend"}>
          <ListItemText primary={"管理联系人"} />
        </ListItemButton>
        <ListItemButton component={Link} to={"changePwd"}>
          <ListItemText primary={"修改密码"} />
        </ListItemButton>
      </List>



      <div className="user-operation">

        <Routes>
          <Route
            path="/editInfo"
            element={<EditInfo />}
          />
          <Route
            path="/unfriend"
            element={<ManageContacts />}
          />
          <Route
            path="/changePwd" 
            element={<EditPwd />}
          />
        </Routes>

      </div>

      
    </div>

    );
}

export default UserProfile;