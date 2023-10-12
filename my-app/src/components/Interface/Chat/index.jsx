import ChatBox from "./ChatBox";
import Contacts from "./Contacts";
import {Grid, Paper, Typography} from "@mui/material";
import { Route, Routes } from "react-router-dom"


function Chat(userInfo){

  return(
    <div>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <Paper className="contacts">
            <Contacts {...userInfo}/>
          </Paper>
        </Grid>

        <Grid item md={9}>
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

export default Chat;