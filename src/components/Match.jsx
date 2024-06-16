import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
import { teamStyle, timeStyle, matchStyle, buttonStyle, matchContainerStyle, goalsInputStyle } from '../styles/matchStyle'
import '../styles/matchstyle.css'
import predictionsService from '../services/predictions'

const Match = ({ match, makePrediction, user }) => {

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
  const [pointsGained, setPointsGained] = useState(0)
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
        setOtherPredictions( preds.filter(pred => pred.username !== user.username) )
    )
  }, [predictionExists, hasEnded, predictionMade]);


  const handleHomeGoalsPrediction = (event) => {
    setHomeGoalsPrediction(event.target.value);
  };

  const handleAwayGoalsChange = (event) => {
    setAwayGoalsPrediction(event.target.value);
  };




  const handleMakePrediction = () => {
    const homeToSend = homeGoalsPrediction === '' ? 0 : Number(homeGoalsPrediction);
    const awayToSend = awayGoalsPrediction === '' ? 0 : Number(awayGoalsPrediction);
    const success = makePrediction(match, homeToSend, awayToSend);
    if (success) {
        setPredictionMade(true)
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
                    console.log("user has made prediction for match: " + match.home + "-" + match.away) 
                    console.log("pred:" + JSON.stringify(matchToSearch))
                    // add goals to show for the match to be the users prediction
                    setHomeGoalsPredictionToShow(matchToSearch.homeGoals);
                    setAwayGoalsPredictionToShow(matchToSearch.awayGoals);
                    setWinnerPrediction(matchToSearch.winner)
                    console.log("homegoals pred from obj" + matchToSearch.homeGoals)
                    console.log("homeGoals pred: " + homeGoalsPredictionToShow)
                    console.log("winner pred " + winnerPrediction)
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
        const today = new Date();
        const matchDate = new Date(match.date);
        const timeDiff = matchDate.getTime() - today.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        return daysDiff >= 1.5;
      };

      const isMatchInHistory = async () => {
        /*
        const today = new Date();
        const matchDate = new Date(match.date);
        const timeDiff = matchDate.getTime() - today.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        console.log("days dif " + daysDiff)
        setHomeGoalsResult(match.homeGoals)
        setAwayGoalsResult(match.awayGoals)
        if (daysDiff < -0.3) {setHasEnded(true)}
        const today = new Date();
        const matchDate = new Date(match.date);
        const timeDiff = today.getTime() - matchDate.getTime();
        */

        // Check if the match ended more than 3 hours ago
        if (match.winner) { // 3 hours in milliseconds
            setHasEnded(true)

            // TODO add draw points

            await userHasAlreadyMadePredicion()
            setHomeGoalsResult(match.homeGoals);
            setAwayGoalsResult(match.awayGoals);
            setHasEnded(true);
            /*
            if ((Number(match.homeGoals) === Number(homeGoalsPredictionToShow)) && (Number(match.awayGoals) === Number(awayGoalsPredictionToShow))) {
                setPointsGained(10)
                setPointsExplanation('oikea tulos')
            } else if (match.winner === winnerPrediction){
                console.log("goals predicted: " + (Number(match.homeGoals) + " " + Number(homeGoalsPredictionToShow)))
                if ((Number(match.homeGoals) === Number(setHomeGoalsPredictionToShow)) || (Number(match.awayGoals) === Number(awayGoalsPredictionToShow))) {
                    console.log("winner predicted and one teams goals predicted")
                    setPointsGained(4)
                    setPointsExplanation('Voittaja ja toisen joukkueen maalit oikein')
                } else {
                    console.log("winner predicted")
                    setPointsGained(3)
                    setPointsExplanation('Voittaja oikein')
                }
            } else if ((Number(match.homeGoals) === Number(homeGoalsPredictionToShow)) || (Number(match.awayGoals) === Number(awayGoalsPredictionToShow))) {
                setPointsGained(1)
            } else {
                setPointsGained(0)
                setPointsExplanation('Paska veikkaus')
            }*/
        }
      };


    
      // If match is two or more days later than today, don't render
      if (isMatchInFuture()) {
        return null;
      }
      
      /*
  return (
    <div>
    <div style={matchContainerStyle}>
        <span style={timeStyle}>{matchTime}</span>
    <div className='match' style={matchStyle} display={'flex'}>
      <div style={teamStyle}>
        <span>{match.home}</span>
        <img src={match.homeLogo} style={{ width: '30px', height: '30px' }} />
        {(!predictionExists && !matchStarted) ? (
          <input 
            type="number" 
            value={homeGoalsPrediction} 
            onChange={handleHomeGoalsPrediction} 
            style={goalsInputStyle}
          />
        ) : ( <div><span>{homeGoalsPredictionToShow}</span></div>) }
        </div>
        <span> - </span>
        <div style={teamStyle}>
        {(!predictionExists && !matchStarted) ? (
          <input 
            type="number" 
            value={awayGoalsPrediction} 
            onChange={handleAwayGoalsChange} 
            style={goalsInputStyle}
          /> ) : ( <span>{awayGoalsPredictionToShow}</span>) }
          <img src={match.awayLogo} style={{ width: '30px', height: '30px' }} />
          <span>{match.away}</span>
          {(!predictionExists && !matchStarted) && (<button style={buttonStyle} onClick={handleMakePrediction}>Make Prediction</button>)}
      </div>
    </div>
    </div>
    {hasEnded && (
        <div style={{ fontSize: 'small' }}>
        <p>lopputulos {homeGoalsResult} - {awayGoalsResult} pojoja saatu: {pointsGained} ({pointsExplanation})</p>
        {otherPredictions.map(prediction =>
            <span key={prediction.id}>
                {prediction.username} {prediction.homeGoals} - {prediction.awayGoals}&nbsp;&nbsp;&nbsp;
                </span>
          )}
          </div>
        )}
    </div>
  )*/
    
  return (
    <div className='matchContainerStyle'>

      <div className='matchStyle' display={'flex'}>

        <span className='timeStyle'>{matchTime}</span>

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
                  //borderRadius: '50%',
                }}
              />
            </div>
            <span>{match.home}</span>
          </div>
          <div>
<div className='inputContainerStyle'>

              {(!predictionExists && !matchStarted && !predictionMade) ? (
                <input
                  className='goalsInputStyle'
                  type="number"
                  value={homeGoalsPrediction}
                  onChange={handleHomeGoalsPrediction}

                />
              ) : (<span>{homeGoalsPredictionToShow}</span>)}
            </div>
            <span style={{ marginBottom: 15 }}> - </span>
            <div className='inputContainerStyle'>

              {(!predictionExists && !matchStarted && !predictionMade) ? (
                <input
                  className='goalsInputStyle'
                  type="number"
                  value={awayGoalsPrediction}
                  onChange={handleAwayGoalsChange}

                />) : (<span>{awayGoalsPredictionToShow}</span>)}
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
                  //borderRadius: '50%',
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
  {matchStarted && (
    <div style={{ fontSize: 'x-small' }}>
      {hasEnded && (
      <p>lopputulos {homeGoalsResult}-{awayGoalsResult} pojoja saatu: {predictionPoints} ({pointsExplanation})</p>
      )}
      <button onClick={() => setShowOthers(!showOthers)}>
        Näytä muiden vedot
      </button>
      <div>
      {showOthers && otherPredictions.map(prediction => (
        <span key={prediction.id}>
          {prediction.username} {prediction.homeGoals}-{prediction.awayGoals}&nbsp;&nbsp;&nbsp;
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
    makePrediction: PropTypes.func.isRequired,
    user: PropTypes.shape({
        token: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
    })
};


export default Match