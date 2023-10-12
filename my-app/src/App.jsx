import LoginForm from './components/LoginForm';
import {HashRouter, Route, Routes } from "react-router-dom"
import Interface from './components/Interface';
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
            path="/interface/*"
            element={<Interface />}
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
