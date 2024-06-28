import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
//import { teamStyle, timeStyle, matchStyle, buttonStyle, matchContainerStyle, goalsInputStyle } from '../styles/matchStyle'
import '../styles/matchstyle.css'
import predictionsService from '../services/predictions'


const Match = ({ match, user, hideOld, hideFuture, setNotification, setNotificationType, setMatches }) => {

  // TODO add draw points

  const [homeGoalsPrediction, setHomeGoalsPrediction] = useState('')
  const [awayGoalsPrediction, setAwayGoalsPrediction] = useState('')
  const [homeGoalsPredictionToShow, setHomeGoalsPredictionToShow] = useState('')
  const [awayGoalsPredictionToShow, setAwayGoalsPredictionToShow] = useState('')
  const [winnerPrediction, setWinnerPrediction] = useState('')
  const [predictionExists, setPredictionExists] = useState(false)
  const [matchStarted, setMatchStarted] = useState(false)
  const [matchTime, setMatchTime] = useState('')
  const [predictionMade, setPredictionMade] = useState(false)
  const [predictionPoints, setPredictionPoints] = useState(0)

  const [hasEnded, setHasEnded] = useState(false)
  const [homeGoalsResult, setHomeGoalsResult] = useState('')
  const [awayGoalsResult, setAwayGoalsResult] = useState('')
  const [pointsExplanation, setPointsExplanation] = useState('')
  const [otherPredictions, setOtherPredictions] = useState([])

  const [showOthers, setShowOthers] = useState(false)

  useEffect(() => {
    const fetchInfo = async () => {
      const hasMatchStarted = new Date(match.date) <= new Date();
      setMatchStarted(hasMatchStarted);
      const predictionsExists = await userHasAlreadyMadePredicion()
      setPredictionExists(predictionsExists)
      setMatchTime(formatDate(match.date))
      isMatchInHistory()
    }
    fetchInfo()

    predictionsService.getAllForTheMatch(match.id).then(preds =>
      setOtherPredictions(preds.filter(pred => pred.username !== user.username).sort((a, b) => b.points - a.points))
    )
  }, [hasEnded, predictionMade, predictionExists]);


  const handleHomeGoalsPrediction = (event) => {
    setHomeGoalsPrediction(event.target.value);
  };

  const handleAwayGoalsChange = (event) => {
    setAwayGoalsPrediction(event.target.value);
  };

  const handleMakePrediction = () => {
    const homeToSend = homeGoalsPrediction === '' ? 0 : Number(homeGoalsPrediction);
    const awayToSend = awayGoalsPrediction === '' ? 0 : Number(awayGoalsPrediction);
    const success = predictionsService.makePrediction(match, homeToSend, awayToSend, user, setNotification, setNotificationType, setMatches, setPredictionMade, setPredictionExists);
    if (success) {
      setPredictionMade(true)
      //setPredictionExists(true)
      setHomeGoalsPredictionToShow(homeToSend);
      setAwayGoalsPredictionToShow(awayToSend);
    }
  };

  // check if user has already made a prediction for the game
  // if true, then his prediction is shown instead of goal input forms
  const userHasAlreadyMadePredicion = async () => {
    try {
      // get all predictions by the user
      const response = await axios.get(`https://footballpredictapp-backend.onrender.com/api/predictions/username/${user.username}`);
      if (response.data) {
        // loop through the predictions
        for (const matchToSearch of response.data) {
          // if found a prediction for the same matchId as the match to show
          if (matchToSearch.matchId === match.id) {
            // add goals to show for the match to be the users prediction
            setHomeGoalsPredictionToShow(matchToSearch.homeGoals);
            setAwayGoalsPredictionToShow(matchToSearch.awayGoals);
            setWinnerPrediction(matchToSearch.winner)
            setPredictionExists(true);
            if (matchToSearch.points !== null) {
              setPredictionPoints(matchToSearch.points)
              if (matchToSearch.points === 10) {
                setPointsExplanation('oikea tulos')
              } else if (matchToSearch.points === 4) {
                setPointsExplanation('Voittaja ja toisen joukkueen maalit oikein')
              } else if (matchToSearch.points === 3) {
                setPointsExplanation('Voittaja oikein')
              } else if (matchToSearch.points === 1) {
                setPointsExplanation('Toisen joukkueen maalit oikein')
              } else if (matchToSearch.points === 0) {
                setPointsExplanation('Paska veikkaus')
              }
            }
            return true; // Return true
          }
        }
      }
      return false; // Return false if match is not found in predictions
    } catch (err) {
      console.log("Error fetching predictions:", err);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZone: 'Europe/Helsinki' // Set timezone to Helsinki
    };
    return date.toLocaleString('en-US', options);
  };

  const isMatchInFuture = () => {
    if (hideFuture) {
      const today = new Date();
      const matchDate = new Date(match.date);
      const timeDiff = matchDate.getTime() - today.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      return daysDiff >= 1.5;
    }
  };

  const isOldMatch = () => {
    if (hideOld) {
      const today = new Date();
      today.setHours(0,0,0,0)
      const matchDate = new Date(match.date);
      matchDate.setHours(0,0,0,0)
      return matchDate < today;
    }
  }

  const isMatchInHistory = async () => {
    // Check if the match ended more than 3 hours ago
    if (match.winner) {
      setHasEnded(true)
      await userHasAlreadyMadePredicion()
      setHomeGoalsResult(match.homeGoals);
      setAwayGoalsResult(match.awayGoals);
      setHasEnded(true);
    }
  };

  // If match is two or more days later than today, don't render
  
  if (isMatchInFuture()) {
    return null;
  }

  if (isOldMatch()) {
    return null
  }

  return (
    <div className='matchContainerStyle'>
      <div className='matchStyle' display={'flex'}>
        <div className='timeStyle'>
        <span >{matchTime}</span>
        </div>
        <div style={{justifyContent: 'center', alignItems: 'center'}} className='resultStyle'>
        {!predictionExists ? (<p></p>) : hasEnded ? <span style={{color:"white"}}>Lopputulos</span>: <span>Matsi ei alkanut/kesken</span>}
        </div>
        <div className='predictionContainerStyle'>
          <div>
          </div>
          <div className='teamStyle'>
            <div style={{ width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', overflow: 'hidden' }}>
              <img
                src={match.homeLogo}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
            <span>{match.home}</span>
          </div>
          <div className="scorePredictionStyle">
            <div className='inputContainerStyle'>
              {(!predictionExists && !matchStarted && !predictionMade) && (
                <input
                  className='goalsInputStyle'
                  type="number"
                  value={homeGoalsPrediction}
                  onChange={handleHomeGoalsPrediction}
                />
              )} { (hasEnded ? <span>{homeGoalsResult}</span> : <span>{}</span>)} 
            </div>
            <span style={{ marginBottom: 15 }}> - </span>
            <div className='inputContainerStyle'>
              {(!predictionExists && !matchStarted && !predictionMade) && (
                <input
                  className='goalsInputStyle'
                  type="number"
                  value={awayGoalsPrediction}
                  onChange={handleAwayGoalsChange}
                />)} { (hasEnded ? <span>{awayGoalsResult}</span> : <span>{}</span>)} 
            </div>
          </div>
          <div className='teamStyle'>
            <div style={{ width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', overflow: 'hidden' }}>
              <img
                src={match.awayLogo}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
            <span>{match.away}</span>
          </div>
          <div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '10px' }}>
          {(!predictionExists && !matchStarted && !predictionMade) && (<button className='buttonStyle' onClick={handleMakePrediction}>Veikkaa</button>)}
        </div>
      </div>
      <div>
        {(predictionExists || predictionMade || matchStarted) && (
          <div className='endResultStyle'>
              {hasEnded ? <p style={{textAlign: 'center'}}>oma veikkaus {homeGoalsPredictionToShow}-{awayGoalsPredictionToShow} pojoja saatu: {predictionPoints} ({pointsExplanation})</p> : 
              <p>oma veikkaus {homeGoalsPredictionToShow}-{awayGoalsPredictionToShow}</p>}
            <button onClick={() => setShowOthers(!showOthers)}>
              Näytä muiden vedot
            </button>
            <div>
              {showOthers && otherPredictions.map(prediction => (
                <span key={prediction.id} style={{paddingLeft: '1px', paddingRight: '1px'}}>
                  {prediction.username} {prediction.homeGoals}-{prediction.awayGoals} ({prediction.points}p)&nbsp;&nbsp;&nbsp;
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

Match.propTypes = {
  match: PropTypes.shape({
    date: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    home: PropTypes.string.isRequired,
    homeLogo: PropTypes.string.isRequired,
    away: PropTypes.string.isRequired,
    awayLogo: PropTypes.string.isRequired,
    homeGoals: PropTypes.number,
    awayGoals: PropTypes.number,
    winner: PropTypes.string
  }).isRequired,
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }),
  hideOld: PropTypes.bool.isRequired,
  hideFuture: PropTypes.bool.isRequired,
  setNotification: PropTypes.func.isRequired,
  setNotificationType: PropTypes.func.isRequired, 
  setMatches: PropTypes.func.isRequired
}


export default Match