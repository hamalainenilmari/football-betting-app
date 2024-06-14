import axios from 'axios'
const baseUrl = 'https://footballpredictapp-backend.onrender.com//api/matches'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

export default { getAll }