import React, { useEffect, useState } from "react";
import Chat from "./Chat"
import TopBar from "./TopBar";
import UserProfile from "./UserProfile";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CircularProgress, Grid } from "@mui/material";

import { useDispatch, useSelector } from 'react-redux';
import {fetchUserInfo} from './actions';

function Interface(){

  const navigate = useNavigate();

  const dispatch=useDispatch();
  const status=useSelector(state=>state.userInfo.status);


  useEffect(()=>{
    dispatch(fetchUserInfo());
  }, [dispatch]); // 该组件在dispatch变化时重新渲染

  if(status!=='succeeded') {
    return <CircularProgress />
  }
  if(status==='failed'){
    alert("出现错误，请重新登录")
    navigate('/');
    return;
  }

  return(
    <div>
      <Grid container spacing={2}>

        <Grid item sm={12}>
          <TopBar />
        </Grid>

        <Grid item sm={12}>
          <Routes>
            <Route
              path="/chat/*"
              element={<Chat />}
            />
            <Route
              path="/profile/*"
              element={<UserProfile />}
            />
          </Routes>
        </Grid>

      </Grid>

    </div>
    
  );
}

export default Interface;

