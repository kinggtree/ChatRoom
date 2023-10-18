import React, { useEffect, useState } from "react";
import './styles.css';
import axios from "axios";
import { List, 
    ListItemText, 
    CircularProgress, 
    Typography,
    ListItemButton,
    Paper,
} from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";
import EditInfo from "./EditInfo";
import ManageContacts from "./ManageContacts"
import EditPwd from "./EditPwd";



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
            element={<ManageContacts {...personalInfo} updateInfo={updateInfo}/>}
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