import { Button, Toolbar, Typography } from "@mui/material";
import React, { useEffect } from "react";
import './styles.css';

function TopBar() {

  var username="undefined";

  useEffect(()=>{
    username="Null";
  }, []);

  return(
    <Toolbar className="top-bar">
      <Typography variant="h5" color="inherit" className="top-bar-welcome">
        Welcome, user {username}.
      </Typography>
      <Button className="top-bar-logout" variant="contained" color="error">
        Log Out
      </Button>
    </Toolbar>
  )
}

export default TopBar;
