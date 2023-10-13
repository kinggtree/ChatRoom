import React, { useState } from 'react';
import ChatBox from "./ChatBox";
import Contacts from "./Contacts";
import {Grid, Paper, Typography, useMediaQuery, useTheme, Button, Drawer} from "@mui/material";
import { Route, Routes } from "react-router-dom";

function Chat(userInfo){
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md')); // 适应中等或更小尺寸的屏幕
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return(
    <div>
      <Grid container spacing={2}>
        {/* 使用 isMediumScreen 判断是否要显示 Contacts 组件 */}
        {!isMediumScreen && (
          <Grid item md={3}>
            <Paper className="contacts">
              <Contacts {...userInfo}/>
            </Paper>
          </Grid>
        )}
        
        <Grid item md={isMediumScreen ? 12 : 9}>
          <Paper className="chat-interface">
            {/* 当屏幕宽度较小时，显示一个按钮来打开 Drawer */}
            {isMediumScreen && (
              <Button onClick={handleDrawerToggle}>Show Contacts</Button>
            )}
            <Routes>
              <Route
                path="/"
                element={
                  <Typography variant='body1'>
                    Welcome to this app!
                  </Typography>
                } 
              />
              <Route
                path=":user_id"
                element={<ChatBox {...userInfo} />} 
              />
            </Routes>
          </Paper>
        </Grid>        
        
      </Grid>

      {/* 当屏幕宽度较小时，通过 Drawer 来显示 Contacts 组件 */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Contacts {...userInfo}/>
      </Drawer>
    </div>
  )
}

export default Chat;
