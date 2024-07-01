import axios from 'axios'
const baseUrl = 'https://footballpredictapp-backend.onrender.com/api/predictions'
import matchService from './matches'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    console.log(response.data)
    return response.data
}

const getAllForTheMatch = async (matchId) => {
    const response = await axios.get(baseUrl + `/match/${matchId}`)
    return response.data
}

const makePrediction = async ( match, homeGoalsPrediction, awayGoalsPrediction, user, setNotification, setNotificationType, setMatches, setPredictionMade, setPredictionExists ) => {
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
            setMatches( matches.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
          )
          setPredictionMade(true)
          setPredictionExists(true)
          }, 5000)
          return true
      } else {
          setNotification("Veikkauksen tallentaminen ei onnistunut. Päivitä sivu ja kokeile uudestaan. Jos ei toimi vielkää ota yhteyttä ensin aspaan (lukas) ja sit toimariin (ile")
          setNotificationType('danger')
          setTimeout( () => {
            setNotification(null)
            setNotificationType(null)
            }, 7000)
            return false
      }
    } catch (err) {
      setNotification("Veikkauksen tallentaminen ei onnistunut. Päivitä sivu ja kokeile uudestaan. Jos ei toimi vielkää ota yhteyttä ensin aspaan (lukas) ja sit toimariin (ile)")
      setNotificationType('danger')
      setTimeout( () => {
        setNotification(null)
        setNotificationType(null)
        }, 5000)
      return false
    }
  }

export default { getAll, getAllForTheMatch, makePrediction }