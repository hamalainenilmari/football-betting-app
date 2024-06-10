import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Predictions } from "./pages/Predictions";
import { Users } from "./pages/Users";
import Navbar from "./components/Navbar";
import Login from './components/Login';
import { login } from './services/userManagement';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    setIsLoggedIn(false);
  };


    return (
      
      <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Container className="mb-4" style={{ marginTop: '80px' }}>
        <Routes>
          <Route path="/home" element={isLoggedIn ? <Home /> : <Login handleLogin={handleLogin} />} />
          <Route path="/Predictions" element={isLoggedIn ? <Predictions /> : <Login handleLogin={handleLogin} />} />
          <Route path="/Users" element={isLoggedIn ? <Users /> : <Login handleLogin={handleLogin} />} />
        </Routes>
      </Container>
    </Router>
  );

}

export default App;
