import LoginForm from './components/LoginForm';
import {HashRouter, Route, Routes } from "react-router-dom"
import ChatInterface from './components/ChatInterface';
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
        </Routes>
      </HashRouter>
  );
}

export default App;
