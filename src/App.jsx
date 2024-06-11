import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Predictions } from "./pages/Predictions";
import { Users } from "./pages/Users";
import Navbar from "./components/Navbar";
import Login from './components/Login';
import { login } from './services/userManagement';
import Notification from './components/Notification';

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /*
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      setIsLoggedIn(true);
    }
  }, []);
  */

  // eslint-disable-next-line no-unused-vars

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newUserUsername, setNewUserUsername] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  let token = null

  const setToken = newToken => {
    token = `Bearer ${newToken}`
  }

    useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        setToken(user.token)
    }
    }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    setIsLoggedIn(false);
  };

  /*
  const handleLogin = () => {
    window.localStorage.setItem('loggedUser');
    setIsLoggedIn(true);
  };
  */


  useEffect(() => {
  const loggedUserJSON = window.localStorage.getItem('loggedUser')
  if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
  }
  }, [])

  const handleLogin = async (event) => {
      event.preventDefault()

      try {
          const user = await login({
          username, password
          })
          window.localStorage.setItem(
          'loggedUser', JSON.stringify(user)
          )
          
          setToken(user.token)
          setUser(user)
          setUsername('')
          setPassword('')
          setIsLoggedIn(true)

      } catch (exception) {
          setErrorMessage('Incorrect username or password')
          setTimeout( () => {
          setErrorMessage(null)
          }, 5000)
      }
      console.log('logging in with', username, password)
      }


  if (!user) {
    return (
      <form onSubmit={handleLogin}>
      <h1>EM 2024 veikkausskaba</h1>
      <div>
          <h2>Kirjaudu sisään</h2>
          <Notification message={errorMessage} />
          käyttäjätunnus 
          <input 
            style={{ marginLeft: '5px' }}
            data-testid='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)} 
          />
      </div>
      <div>
          salasana
          <input
          style={{ marginLeft: '5px' }}
          data-testid='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <button type="submit">kirjaudu</button>
      </form>
    )
  } else {

    return (
      <>
      
      <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Container className="mb-4" style={{ marginTop: '80px' }}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/Predictions" element={<Predictions />} />
          <Route path="/Users" element={<Users />} />
        </Routes>
      </Container>
    </Router>
    </>
  );
}

}

export default App;
