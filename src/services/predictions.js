import axios from 'axios'
const baseUrl = 'https://footballpredictapp-backend.onrender.com/api/predictions'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    console.log(response.data)
    return response.data
}

const getAllForTheMatch = async (matchId) => {
    const response = await axios.get(baseUrl + `/match/${matchId}`)
    return response.data
}

export default { getAll, getAllForTheMatch }