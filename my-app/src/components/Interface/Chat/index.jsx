import React, { useState } from 'react';
import FriendBox from "./FriendBox";
import Contacts from "./Contacts";
import {Grid, Paper, Typography, useMediaQuery, useTheme, Button, Drawer, Box} from "@mui/material";
import { Route, Routes } from "react-router-dom";
import './styles.css'

function Chat(userInfo){
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
          <Grid item sm={3}>
            <Paper className="contacts">
              <Contacts {...userInfo}/>
            </Paper>
          </Grid>
        )}
        
        <Grid item sm={isMediumScreen ? 12 : 9}>
          <div className="chat-interface">
            {/* 当屏幕宽度较小时，显示一个按钮来打开 Drawer */}
            {isMediumScreen && (
              <Button onClick={handleDrawerToggle} variant='contained' className='show-contacts'>Show Contacts</Button>
            )}
            <Routes>
              <Route
                path="/"
                element={
                  <Paper sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100px'
                    }}>
                    <Typography variant='h6'>
                      Welcome to Chat Room!
                    </Typography>
                  </Paper>

                } 
              />
              <Route
                path=":user_id/*"
                element={<FriendBox {...userInfo} />} 
              />
            </Routes>
          </div>
        </Grid>
      </Grid>

      {/* 当屏幕宽度较小时，通过 Drawer 来显示 Contacts 组件 */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle} className='drawer-contacts'>
        <Box width={250}>
          <Contacts {...userInfo}/>
        </Box>
      </Drawer>
    </div>
  )
}

export default Chat;
