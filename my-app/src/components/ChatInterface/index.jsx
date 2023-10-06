import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import Contacts from "./Contacts";
import TopBar from "./TopBar";
import {Grid, Paper, Typography, CircularProgress} from "@mui/material";
import axios from "axios";
import { Route, Routes } from "react-router-dom"



function ChatInterface(){
  const[userInfo, setUserInfo]=useState({});
  const[loading, setLoading]=useState(true);

  useEffect(()=>{
    axios.get('/api/getUserInfo')
      .then((response)=>{
        setUserInfo(response.data);
        setLoading(false);
      })
      .catch((err)=>{
        console.log("err occurred: ", err);
        setLoading(false);
      })
  }, []); // 加上空依赖数组，这样这个effect只会在组件mount的时候执行一次

  if(loading) {
    return <CircularProgress />
  }

  return(
    <div>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <TopBar {...userInfo}/>
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
            </Routes>
          </Paper>
        </Grid>
        
      </Grid>
    </div>
  )
}

export default ChatInterface;