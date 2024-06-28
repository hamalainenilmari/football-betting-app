import { useState, useEffect } from 'react'
import matchService from './services/matches'
import {login} from './services/userManagement'
import Notification from './components/Notification'
import Match from './components/Match'
import Table from './components/Table'
import { buttonStyle, infoButtonStyle, inputContainerStyle, labelStyle, inputStyle, matchStyle } from './styles/appStyle'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [matches, setMatches] = useState([])

  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  const [showInfo, setShowInfo] = useState(false)
  
  const [hideOld, setHideOld] = useState(true)
  const [hideOldInfoText, setHideOldInfoText] = useState("näytä vanhat pelit")

  const [hideFuture, setHideFuture] = useState(true)
  const [hideFutureInfoText, setHideFutureInfoText] = useState("näytä myöhemmät pelit")
    
  let token = null

  const setToken = newToken => {
    token = `Bearer ${newToken}`
  }
  useEffect(() => {
    matchService.getAll().then(matches =>
      setMatches( matches.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
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
      setNotification('Väärä salasana tai tunnus')
      setNotificationType('danger')
      setTimeout( () => {
        setNotification(null)
        setNotificationType(null)
      }, 10000)
    }
    setNotification(`Tervetuloa takaisin ${username}!`)
    setNotificationType('login')
    setTimeout( () => {
      setNotification(null)
      setNotificationType(null)
    }, 10000)
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <Notification message={notification} type={notificationType} />
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

  const handleHideOldGames = () => {
    if (hideOld) {
      setHideOld(!hideOld)
      setHideOldInfoText("piiloita vanhat pelit")
    } else {
      setHideOld(!hideOld)
      setHideOldInfoText("näytä vanhat pelit")
    }
  }

  const handleHideFutureGames = () => {
    if (hideFuture) {
      setHideFuture(!hideFuture)
      setHideFutureInfoText("piiloita myöhemmät pelit")
    } else {
      setHideFuture(!hideFuture)
      setHideFutureInfoText("näytä myöhemmät pelit")
    }
  }

  const infoStyle = {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'opacity 0.5s ease-in-out',
    opacity: showInfo ? 1 : 0,
    maxHeight: showInfo ? '100px' : '0',
    overflow: 'hidden',
    fontSize: '12px'
  };
  
  if (user) {
    return(
      <div>
        <Notification message={notification} type={notificationType} />
      <div style={matchStyle}>
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
      <button onClick={() => handleHideOldGames()} style={infoButtonStyle}>{hideOldInfoText}</button>
        {matches.map(match =>
          <Match key={match.id}
            match={match}
            user={user}
            hideOld={hideOld}
            hideFuture={hideFuture}
            setNotification={setNotification}
            setNotificationType={setNotificationType}
            setMatches={setMatches}
          />
        )}
        <button onClick={() => handleHideFutureGames()} style={infoButtonStyle}>{hideFutureInfoText}</button>
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
