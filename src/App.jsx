import { useState, useEffect } from 'react'
import matchService from './services/matches'
import {login} from './services/userManagement'
import Notification from './components/Notification'
import Match from './components/Match'
import Table from './components/Table'
import { buttonStyle, infoButtonStyle, inputContainerStyle, labelStyle, inputStyle, matchStyle } from './styles/appStyle'
import './styles/wiggle.css'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import lukas from './styles/lukas.png'

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
      }, 5000)
    }
    setNotification(`Tervetuloa takaisin ${username}!`)
    setNotificationType('login')
    setTimeout( () => {
      setNotification(null)
      setNotificationType(null)
    }, 5000)
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

  const BackdropStyle = styled('div')(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    zIndex: -1,
  }));
  
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vw', // Use viewport width to make it responsive
    maxWidth: '600px', // Set a maximum width
    maxHeight: '80vh', // Set a maximum height
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    padding: '16px',
    borderRadius: '8px',
    overflowY: 'auto',
  };

  const WiggleButton = styled(Button)(({ theme }) => ({
    animation: 'wiggle 2s ease-in-out infinite',

    '@keyframes wiggle': {
      '0%': { transform: 'rotate(0deg)' },
     '80%': { transform: 'rotate(0deg)' },
     '85%': { transform: 'rotate(5deg)' },
     '95%': { transform: 'rotate(-5deg)' },
    '100%': { transform: 'rotate(0deg)' },
  }
  }));

  const InfoModal = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
<div>
      <WiggleButton variant="contained" color="primary" onClick={handleOpen}>
        Info
      </WiggleButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={BackdropStyle}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Info pudotuspelien pisteistä
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Pudotuspelien pisteet muodostuu samalla tavalla kun ennenkin, vaikka tulis jatkoaika/pilkut.
            <br />
            <br />
            Jos oot veikannu et matsi päättyy tasan ja se päättyy tasan varsinaisella nii saat ne pojot iha sama kumpi menee jatkoon lopulta.
            <br />
            <br />
            Jos oot veikannu et kotijoukkue voittaa ja varsinainen päättyy tasapeliin nii vaikka kotijoukkue voittais jatkoajalla, siitä ei tuu pisteitä.
            <br />
            <br />
            Jos haluutte jonkin toisen tavan tähän nii infotkaa! (lukas on asiakaspalvelija)
          </Typography>
          <img src={lukas} style={{ maxWidth: '100%', height: 'auto', maxHeight: '10%', justifyContent: "center" }} />
          <Button variant="contained" color="primary" onClick={handleClose} >Ok</Button>
        </Box>
      </Modal>
    </div>
    );
    /*
    window.alert(
      "Pudotuspelien pisteet jakautuu samalla tavalla kun ennenkin (varsinainen peliaika), vaikka tulis jatkoaika/pilkut.\n\n" +
      "Jos oot veikannu et matsi päättyy tasan ja se päättyy tasan varsinaisella nii saat ne pojot iha sama kumpi menee jatkoo.\n\n"+
    "Jos oot veikannu et kotijoukkue voittaa ja varsinainen päättyy tasapeliin nii vaikka kotijoukkue voittais jatkoajalla, siitä ei tuu pisteitä.")
    */
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
      <InfoModal />
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
