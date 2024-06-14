import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';

const Match = ({ match, makePrediction, user }) => {

  const [homeGoalsPrediction, setHomeGoalsPrediction] = useState('')
  const [awayGoalsPrediction, setAwayGoalsPrediction] = useState('')
  const [homeGoalsPredictionToShow, setHomeGoalsPredictionToShow] = useState('')
  const [awayGoalsPredictionToShow, setAwayGoalsPredictionToShow] = useState('')
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
    justifyContent: 'space-between', // Remove this line
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const teamStyle = {
    display: 'flex',
    alignItems: 'center',
    marginRight: '5px', // Add margin to create space between teams
  };



  const handleHomeGoalsPrediction = (event) => {
    setHomeGoalsPrediction(event.target.value);
  };

  const handleAwayGoalsChange = (event) => {
    setAwayGoalsPrediction(event.target.value);
  };

  const handleMakePrediction = () => {
    const homeToSend = homeGoalsPrediction === '' ? 0 : Number(homeGoalsPrediction);
    const awayToSend = awayGoalsPrediction === '' ? 0 : Number(awayGoalsPrediction);
    makePrediction(match, homeToSend, awayToSend);
  };

  const goalsInputStyle = {
    marginLeft: 10,
    width: '30px', // Make the input field narrower
    padding: '4px', // Reduce padding for a smaller look
    fontSize: '14px', // Adjust font size if needed
    textAlign: 'center' // Center the text for better readability
  };


  const userHasAlreadyMadePredicion = async () => {
    try {
        const response = await axios.get(`https://footballpredictapp-backend.onrender.com/api/predictions/username/${user.username}`);
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
      /*
      const dateStyle = {
        position: 'absolute', // Position the date absolutely within the parent container
        top: 0, // Position at the top
        left: '50%', // Move to the middle horizontally
        transform: 'translateX(-50%)', // Center horizontally
        backgroundColor: 'rgba(255,255,255,0.8)', // Semi-transparent background
        padding: '5px', // Add padding for better readability
      };
      */
 
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

      const buttonStyle = {
        padding: '4px 4px',
        background: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        fontSize: '12px',
      };
    
      // If match is two or more days later than today, don't render
      if (isMatchInFuture()) {
        return null;
      }
      

  return (
    <div>
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
        ) : ( <span>{homeGoalsPredictionToShow}</span>) }
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