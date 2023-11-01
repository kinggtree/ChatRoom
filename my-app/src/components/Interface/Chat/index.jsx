import React, { useState } from 'react';
import FriendBox from "./FriendBox";
import Contacts from "./Contacts";
import {Grid, Paper, Typography, useMediaQuery, useTheme, Button, Drawer, Box, Container} from "@mui/material";
import { Route, Routes } from "react-router-dom";

import './styles.css'
import GroupBox from './GroupBox';

function Chat(){
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md')); // 适应中等或更小尺寸的屏幕
  const [drawerOpen, setDrawerOpen] = useState(false);

  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return(
    <div>
      <Grid container spacing={1}>
        {/* 使用 isMediumScreen 判断是否要显示 Contacts 组件 */}
        {!isMediumScreen && (
          <Grid item xs={3}>
            <Paper className="contacts">
              <Contacts />
            </Paper>
          </Grid>
        )}
        
        <Grid item xs={isMediumScreen ? 12 : 9}>
          <div className="chat-interface">
            {/* 当屏幕宽度较小时，显示一个按钮来打开 Drawer */}
            {isMediumScreen && (
              <Button onClick={handleDrawerToggle} variant='contained' className='show-contacts'>展示联系人列表</Button>
            )}
            <Routes>
              <Route
                path="/"
                element={
                  <Container>
                    <Paper sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100px'
                      }}>
                      <Typography variant='h6' className=''>
                        欢迎来到聊天室！
                      </Typography>
                    </Paper>
                  </Container>

                } 
              />
              <Route
                path="friend/:user_id/*"
                element={<FriendBox />} 
              />
              <Route
                path="group/:group_id/*"
                element={<GroupBox />}
              />
            </Routes>
          </div>
        </Grid>
      </Grid>

      {/* 当屏幕宽度较小时，通过 Drawer 来显示 Contacts 组件 */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle} className='drawer-contacts'>
        <Box width={250}>
          <Contacts />
        </Box>
      </Drawer>
    </div>
  )
}

export default Chat;
