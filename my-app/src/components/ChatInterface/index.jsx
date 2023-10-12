import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import Contacts from "./Contacts";
import TopBar from "./TopBar";
import {Grid, Paper, Typography, CircularProgress} from "@mui/material";
import axios from "axios";
import { Route, Routes, useNavigate } from "react-router-dom"
import UserProfile from "../UserProfile";


function ChatInterface(){
  const[userInfo, setUserInfo]=useState({});
  const[loading, setLoading]=useState(true);
  const[reRender, setReRender]=useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    axios.post('/api/getUserInfo')
      .then((response)=>{
        setUserInfo(response.data);
        setLoading(false);
      })
      .catch((err)=>{
        if(err.response.status===401){
          alert("Not logged in yet.");
          navigate('/');
        } else {
          alert("err occurred: "+err);
          setLoading(false);
        }
      });
  }, [reRender]); // 该组件在reRender变化时重新渲染

  const updateInfo=()=>{
    setReRender(!reRender);
  }

  if(loading) {
    return <CircularProgress />
  }


  return(
    <div>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <TopBar {...userInfo} updateInfo={updateInfo}/>
        </Grid>

        <Grid item sm={3}>
          <Paper className="contacts">
            <Contacts {...userInfo}/>
          </Paper>
        </Grid>

        <Grid item sm={9}>
          <Paper className="chat-interface">
            <Routes>
              <Route
                path="/"
                element={
                  <Typography variant='body1'>
                    Welcome to this app!
                  </Typography>
                } />
              <Route
                path=":user_id"
                element={<ChatBox {...userInfo} />} />
              <Route
                path="/user_profile"
                element={<UserProfile />} />
            </Routes>
          </Paper>
        </Grid>
        
      </Grid>
    </div>
  )
}

export default ChatInterface;