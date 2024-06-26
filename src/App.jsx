import { useState, useEffect } from 'react'
import matchService from './services/matches'
import {login, signup} from './services/userManagement'
import Notification from './components/Notification'
import Match from './components/Match'
import axios from 'axios'
import Table from './components/Table'


const App = () => {
  const [matches, setMatches] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newUserUsername, setNewUserUsername] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)
  const [predictionMade, setPredictionMade] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
    
  let token = null

  const setToken = newToken => {
    token = `Bearer ${newToken}`
  }
  useEffect(() => {
    matchService.getAll().then(matches =>
      setMatches( matches.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    )
  }, [predictionMade])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])

  const inputContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    background: ''
  };
  
  const labelStyle = {
    marginBottom: '5px',
    fontSize: '14px',
    background: ''
  };
  
  const inputStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    transition: 'border-color 0.3s ease',
    fontSize: '16px',
  };
  
  const notificationStyle = {
    transition: 'opacity 0.3s ease',
  };
  const mtachStyle ={
    
    alignItems: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    background: 'white'

  }
   

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
    } catch (exception) {
      setNotification('Incorrect username or password')
      setNotificationType('danger')
      setTimeout( () => {
        setNotification(null)
      }, 5000)
    }
    console.log('logging in with', username, password)
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const buttonStyle = {
    padding: '8px 16px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontSize: '16px',
  };

  const infoButtonStyle = {
    padding: '4px 8px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontSize: '14px',
  };
  /*
  buttonStyle:hover = {
    background: '#0056b3',
  };
  */

  const infoStyle = {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'opacity 0.5s ease-in-out',
    opacity: showInfo ? 1 : 0,
    maxHeight: showInfo ? '100px' : '0',
    overflow: 'hidden',
    fontSize: '12px'
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <Notification message={notification} style={notificationStyle} />
        <div style={{ marginBottom: '10px' }}>
        <div style={inputContainerStyle}>
          <h2>Kirjaudu sisään</h2>
          <label style={labelStyle}>käyttäjätunnus</label>
          <input
            data-testid='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            style={inputStyle}
          />
          </div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>salasana</label>
          <input
            data-testid='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            style={inputStyle}
          />
        </div>
        </div>
        <button style={buttonStyle} type="submit">kirjaudu</button>
      </form>
    )
  }

  const handleSignup = async (event) => {
    event.preventDefault()

    try {
        const user = await signup({
        username: newUserUsername,
        password: newUserPassword
        })
        window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
        )
        setToken(user.token)
        setUser(user)
        setNewUserPassword('')
        setNewUserUsername('')
    } catch (exception) {
        setNotification('Error signing up')
        setNotificationType('danger')
        setTimeout( () => {
        setNotification(null)
        }, 5000)
    }
    console.log('logging in with', username, password)
}


const signupForm = () => {
    return (
        <form onSubmit={handleSignup}>
          <Notification message={notification} style={notificationStyle} />
          <div style={{ marginBottom: '10px' }}>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>käyttäjätunnus</label>
            <input
              data-testid='newUserUsername'
              type="text"
              value={newUserUsername}
              name="Username"
              onChange={({ target }) => setNewUserUsername(target.value)}
              style={inputStyle}
            />
          </div>
          </div>
          <div style={{ marginBottom: '10px' }}>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>salasana</label>
              <input
              data-testid='newUserPassword'
              type="password"
              value={newUserPassword}
              name="Password"
              onChange={({ target }) => setNewUserPassword(target.value)}
              style={inputStyle}
              />
          </div>
          </div>
          <button style={buttonStyle} type="submit">Luo tunnus</button>
        </form>
    )
  }

  const appStyle = {
    backgroundImage: `url(./styles/bg1.png)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '100vh', // Adjust according to your needs
    width: '100vw',  // Adjust according to your needs
  };
  

  const makePrediction = async ( match, homeGoalsPrediction, awayGoalsPrediction ) => {
    try {
      console.log("goals: " + homeGoalsPrediction, awayGoalsPrediction)
      const prediction = {
        username: user.username,
        matchId: match.id,
        home: match.home,
        away: match.away,
        homeGoals: homeGoalsPrediction,
        awayGoals: awayGoalsPrediction,
        winner: homeGoalsPrediction > awayGoalsPrediction ? match.home : awayGoalsPrediction > homeGoalsPrediction ? match.away : 'draw',
      }
      const response = await axios.post('https://footballpredictapp-backend.onrender.com/api/predictions', prediction);
      console.log(response)
      if (response.status === 201) {
        setNotification(`Veikkaus ${match.home} ${homeGoalsPrediction} - ${awayGoalsPrediction} ${match.away} isketty sisään`)
        setNotificationType('success')
        setTimeout( () => {
          setNotification(null)
          setNotificationType(null)
          matchService.getAll().then(matches =>
            setMatches(matches)
          );
          setPredictionMade(true)
          }, 5000)
          return true
      } else {
          setNotification("Veikkauksen tallentaminen ei onnistunut")
          setNotificationType('danger')
          setTimeout( () => {
            setNotification(null)
            setNotificationType(null)
            }, 10000)
            return false
      }
    } catch (err) {
      setNotification("Veikkauksen tallentaminen ei onnistunut")
      setNotificationType('danger')
      setTimeout( () => {
        setNotification(null)
        setNotificationType(null)
        }, 10000)
      return false
    }
  }

  
  if (user) {
    return(
      <div>
        <Notification message={notification} type={notificationType} />
      <div style={mtachStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background:'', }}>
        <p>{user.username}</p>
        <p><button onClick={logout}>Kirjaudu ulos</button></p>
      </div>
      <p><button style={infoButtonStyle} onClick={() => setShowInfo(!showInfo)} >Näytä pisteiden jakautuminen</button></p>
      <div style={infoStyle}>
        {showInfo && (
          <ul>
            <li>oikea tulos: 10p</li>
            <li>oikea voittaja & toisen joukkueen maalit oikein: 4p</li>
            <li>oikea voittaja: 3p</li>
            <li>toisen joukkueen maalit oikein: 1p</li>
          </ul>
        )}
      </div>
        {matches.map(match =>
          <Match key={match.id}
            match={match}
            makePrediction={makePrediction}
            user={user}
           
          />
        )}
        <Table />
      </div>
      </div>
    )
  } else {
    return (
      <div>
        <h2>Bettiäppi</h2>
        {loginForm()}
      </div>
    ) 
  }
}

export default App

/*<h2>Luo uusi käyttäjä</h2>
        {signupForm()}*/