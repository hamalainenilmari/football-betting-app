import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';

const Match = ({ match, makePrediction, user }) => {

  const [homeGoalsPrediction, setHomeGoalsPrediction] = useState(0)
  const [awayGoalsPrediction, setAwayGoalsPrediction] = useState(0)
  const [homeGoalsPredictionToShow, setHomeGoalsPredictionToShow] = useState(0)
  const [awayGoalsPredictionToShow, setAwayGoalsPredictionToShow] = useState(0)
  const [predictionExists, setPredictionExists] = useState(false)
  const [matchStarted, setMatchStarted] = useState(false)
  const [matchTime, setMatchTime] = useState('')

  const timeStyle = {
    fontSize: '14px',
    color: '#333',
    marginRight: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Make sure the time spans the entire width
    marginBottom: '10px' // Add margin bottom for spacing
  };


  const matchStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  };

  const teamStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const goalsInputStyle = {
    marginLeft: 10,
  };

  const handleHomeGoalsPrediction = (event) => {
    setHomeGoalsPrediction(Number(event.target.value));
  };

  const handleAwayGoalsChange = (event) => {
    setAwayGoalsPrediction(Number(event.target.value));
  };

  const handleMakePrediction = () => {
    makePrediction(match, homeGoalsPrediction, awayGoalsPrediction);
  };


  const userHasAlreadyMadePredicion = async () => {
    try {
        const response = await axios.get(`https://footballpredictapp-backend.onrender.com//api/predictions/username/${user.username}`);
        if (response.data) {
            for (const matchToSearch of response.data) {
            if (matchToSearch.matchId === match.id) {
                console.log("here") 
                setHomeGoalsPredictionToShow(matchToSearch.homeGoals);
                setAwayGoalsPredictionToShow(matchToSearch.awayGoals);
                setPredictionExists(true);
                return true; // Return true if match is found
            }
            }
        }
        return false; // Return false if match is not found in predictions
        } catch (err) {
        console.log("Error fetching predictions:", err);
        }
    }

    useEffect(() => {
        const hasMatchStarted = new Date(match.date) <= new Date();
        setMatchStarted(hasMatchStarted);
        userHasAlreadyMadePredicion();
        setMatchTime(formatDate(match.date))
      }, []);

      const dateStyle = {
        position: 'absolute', // Position the date absolutely within the parent container
        top: 0, // Position at the top
        left: '50%', // Move to the middle horizontally
        transform: 'translateX(-50%)', // Center horizontally
        backgroundColor: 'rgba(255,255,255,0.8)', // Semi-transparent background
        padding: '5px', // Add padding for better readability
      };
 
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
    
      // If match is two or more days later than today, don't render
      if (isMatchInFuture()) {
        return null;
      }

  return (
    <div>
        <span style={timeStyle}> {matchTime} </span>
    <div className='match' style={matchStyle} display={'flex'}>
      <div style={teamStyle}>
        <span>{match.home}</span>
        <img src={match.homeLogo} style={{ width: '30px', height: '30px' }} />
        {(!predictionExists && !matchStarted) ? (
          <input 
            type="number" 
            value={homeGoalsPrediction} 
            onChange={handleHomeGoalsPrediction} 
            min="0"
            style={goalsInputStyle}
          />
        ) : ( <span>{homeGoalsPredictionToShow}</span>) }
        </div>
        <span> - </span>
        <div style={teamStyle}>
        {(!predictionExists && !matchStarted) ? (
          <input 
            type="number" 
            value={awayGoalsPrediction} 
            onChange={handleAwayGoalsChange} 
            min="0"
            style={goalsInputStyle}
          /> ) : ( <span>{awayGoalsPredictionToShow}</span>) }
          <img src={match.awayLogo} style={{ width: '30px', height: '30px' }} />
          <span>{match.away}</span>
          {(!predictionExists && !matchStarted) && (<button onClick={handleMakePrediction}>Make Prediction</button>)}
      </div>
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