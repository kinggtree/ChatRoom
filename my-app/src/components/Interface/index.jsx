import React, { useEffect, useRef, useState } from "react";
import Chat from "./Chat"
import TopBar from "./TopBar";
import UserProfile from "./UserProfile";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CircularProgress, Grid } from "@mui/material";

import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from "../../reduxActions/userInfoActions";
import { fetchFullContact } from "../../reduxActions/fullContactActions";
import axios from "axios";
import { fetchGroupInfo } from "../../reduxActions/groupInfoActions";
import { initialUnreadContacts } from '../../reduxActions/unreadContactActions';

function Interface(){

  const navigate = useNavigate();

  const dispatch=useDispatch();
  const userInfoStatus=useSelector(state=>state.userInfo.status);
  const userInfoContact=useSelector(state=>state.userInfo.item.contacts);
  const groupInfoStatus=useSelector(state=>state.groupInfo.status);
  const groupInfo=useSelector(state=>state.groupInfo.item);
  const unreadContactStatus=useSelector(state=>state.unreadContact.status);

  const [isLoading ,setIsLoading]=useState(true);

  const eventSourceRef=useRef(null);


  useEffect(()=>{

    axios.post('/api/ping')
      .then(res=>{
        if(res.status===200)
          console.log(res.data);
        else
          console.log("ping warning status: "+res.status);
      }).catch(err=>{
        if(err.response.status===401)
          alert('您还未登录！');
        else
          console.log(err);
        navigate('/');
      })

    dispatch(fetchUserInfo());
    dispatch(fetchGroupInfo());

    eventSourceRef.current=new EventSource('/api/serverSendNew');

    // 当有新消息的时候，向unreadContact里面的state加入新消息
    eventSourceRef.current.onmessage=event=>{
      const data = JSON.parse(event.data);
      // 这里也可以选择导入unreadContactSlice.js里面的action
      dispatch({ type: 'unreadContact/newMessageReceived', payload: data })
    };

    eventSourceRef.current.onerror = error => {
      console.error("SSE error.");
    };

    // 组件卸载的时候断开连接
    return () => {
      if (eventSourceRef.current) {
        console.log("trying to disconnect...");
        eventSourceRef.current.close();
        console.log("sended close req...");
      }
    };
    

  }, [dispatch]); // 该组件在dispatch变化时重新渲染

  
  // 当联系人名单和群组信息名单加载完成后，初始化未读联系人名单
  useEffect(()=>{
    if(userInfoStatus==='succeeded' && groupInfoStatus==='succeeded'){
      // 获取完整联系人名单
      dispatch(fetchFullContact(userInfoContact));
      // 初始化未读状态
      const totalContact=userInfoContact.map(userInfo=>{
        return userInfo.contactId;
      })
      groupInfo.map(group=>{
        totalContact.push(group._id);
      })
      dispatch(initialUnreadContacts(totalContact));
    }
  }, [userInfoStatus, groupInfoStatus]);

  // 当未读联系人列表加载成功后取消loading状态
  useEffect(()=>{
    if(unreadContactStatus==='succeeded')
      setIsLoading(false);
  }, [unreadContactStatus]);

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

