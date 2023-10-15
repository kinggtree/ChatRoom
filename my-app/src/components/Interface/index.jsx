import React, { useEffect, useState } from "react";
import Chat from "./Chat"
import TopBar from "./TopBar";
import UserProfile from "./UserProfile";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CircularProgress, Grid } from "@mui/material";
import axios from "axios";

function Interface(){

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
          navigate('/');
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

        <Grid item sm={12}>
          <TopBar {...userInfo} updateInfo={updateInfo} />
        </Grid>

        <Grid item sm={12}>
          <Routes>
            <Route
              path="/chat/*"
              element={<Chat {...userInfo}/>}
            />
            <Route
              path="/profile/*"
              element={<UserProfile updateInfo={updateInfo} />}
            />
          </Routes>
        </Grid>

      </Grid>
    </div>
    
  );
}

export default Interface;

