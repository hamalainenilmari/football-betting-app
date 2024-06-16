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
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
    
  let token = null

  const setToken = newToken => {
    token = `Bearer ${newToken}`
  }

  useEffect(() => {
    matchService.getAll().then(matches =>
      setMatches( matches )
    )
  }, [])

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
    background: 'green'

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
      setErrorMessage('Incorrect username or password')
      setTimeout( () => {
        setErrorMessage(null)
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
  /*
  buttonStyle:hover = {
    background: '#0056b3',
  };
  */

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <Notification message={errorMessage} style={notificationStyle} />
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
        setErrorMessage('Error signing up')
        setTimeout( () => {
        setErrorMessage(null)
        }, 5000)
    }
    console.log('logging in with', username, password)
}


const signupForm = () => {
    return (
        <form onSubmit={handleSignup}>
          <Notification message={errorMessage} style={notificationStyle} />
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
        console.log("insertion succesful");
        setNotification(`Veikkaus ${match.home} ${homeGoalsPrediction} - ${awayGoalsPrediction} ${match.away} isketty sisään (kusee varmaan)`)
        setTimeout( () => {
          setNotification(null)
          matchService.getAll().then(matches =>
            setMatches(matches)
          );
          }, 5000)
      } else {
          console.log("here")
          setNotification("Veikkauksen tallentaminen ei onnistunut. Johtuu varmaan lukaksesta :/(ile on hidas)")
          setTimeout( () => {
            setNotification(null)
            }, 5000)
      }
    } catch (err) {
      setNotification("Veikkauksen tallentaminen ei onnistunut. Johtuu varmaan lukaksesta :/(ile on hidas)")
          setTimeout( () => {
            setNotification(null)
            }, 5000)
    }
  }

  if (user) {
    return(
      <div style={mtachStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background:'', }}>
        <p>{user.username}</p>
        <p><button onClick={logout}>Kirjaudu ulos</button></p>
      </div>
        <Notification message={notification}/>
        <Notification message={errorMessage}/>
        {matches.map(match =>
          <Match key={match.id}
            match={match}
            makePrediction={makePrediction}
            user={user}
           
          />
        )}
        <Table />
        <p>päivitä sivu kun oot veikannu nii ne paskat näkyy</p>
        <p>loput äpist tulee myöhemmi. jos joku leikkii ja ettii bugei (niit on) nii väärennän sun veikkaukset </p>
      </div>
    )
  } else {
    return (
      <div>
        <h2>Bettiäppi</h2>
        {loginForm()}
        <h2>Luo uusi käyttäjä</h2>
        {signupForm()}
      </div>
    ) 
  }
}

export default App