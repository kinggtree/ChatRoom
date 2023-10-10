import LoginForm from './components/LoginForm';
import {HashRouter, Route, Routes } from "react-router-dom"
import ChatInterface from './components/ChatInterface';
import SignUp from './components/SignUp';
import './App.css';



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
          <Route
            path="/sign-up" 
            element={<SignUp />}
          />
        </Routes>
      </HashRouter>
  );
}

export default App;
