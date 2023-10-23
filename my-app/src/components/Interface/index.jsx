import React, { useEffect, useRef, useState } from "react";
import Chat from "./Chat"
import TopBar from "./TopBar";
import UserProfile from "./UserProfile";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CircularProgress, Grid } from "@mui/material";

import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from "../../reduxActions/userInfoActions";
import { fetchFullContact } from "../../reduxActions/fullContactActions";

function Interface(){

  const navigate = useNavigate();

  const dispatch=useDispatch();
  const userInfoStatus=useSelector(state=>state.userInfo.status);
  const userInfoContact=useSelector(state=>state.userInfo.item.contacts);
  const [isLoading ,setIsLoading]=useState(true);

  const eventSourceRef=useRef(null);


  useEffect(()=>{
    dispatch(fetchUserInfo());

    eventSourceRef.current=new EventSource('/api/serverSendNew');

    eventSourceRef.current.onmessage=event=>{
      const data = JSON.parse(event.data);
      // 这里进行分发Redux操作
      // 这里也可以选择导入unreadContactSlice.js里面的action
      dispatch({ type: 'unreadContact/newMessageReceived', payload: data })
    };

    eventSourceRef.current.onerror = error => {
      console.error("SSE error:", error);
    };

    return () => {
      if (eventSourceRef.current) {
        console.log("trying to disconnect...");
        eventSourceRef.current.close();
        console.log("sended close req...");
      }
    };
    

  }, [dispatch]); // 该组件在dispatch变化时重新渲染

  useEffect(()=>{
    if(userInfoStatus==='succeeded'){
      dispatch(fetchFullContact(userInfoContact));
      dispatch({type:'unreadContact/initialUnreadContact', payload: userInfoContact});
      setIsLoading(false);
    }
  }, [userInfoStatus]);

  if(isLoading) {
    return <CircularProgress />
  }
  
  if(userInfoStatus==='failed'){
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

