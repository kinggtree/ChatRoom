import LoginForm from './components/LoginForm';
import {HashRouter, Route, Routes } from "react-router-dom"
import {Grid, Paper, Typography} from "@mui/material";
import './App.css';

import Contacts from './components/Contacts';
import ChatBox from './components/ChatBox';
import TopBar from './components/TopBar';

function ChatInterface(props){

  return(
    <div>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <TopBar />
        </Grid>

        <Grid item sm={3}>
          <Paper className="contacts">
            <Contacts />
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
                element={<ChatBox {...props} />} />
            </Routes>
          </Paper>
        </Grid>
        
      </Grid>
    </div>
  )
}


function App() {
  return (
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={<LoginForm />}
          />
          <Route
            path="/chat/*"
            element={<ChatInterface />}
          />
        </Routes>
      </HashRouter>
  );
}

export default App;
