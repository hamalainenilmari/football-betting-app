import axios from 'axios'
const baseUrl = 'https://footballpredictapp-backend.onrender.com/'

const login = async credentials => {
  console.log('credentials: '+ credentials)
  const response = await axios.post(baseUrl + "api/login", credentials)
  console.log(response.data)
  return response.data
}

const signup = async credentials => {
    const { username, password} = credentials
    console.log('credentials: '+ {username, password})
    console.log(credentials)
    const response = await axios.post(baseUrl + "api/users", credentials)
    console.log(response.data)
    return response.data
}

const getAll = async () => {
  const response = await axios.get('https://footballpredictapp-backend.onrender.com/api/users')
  console.log(response.data)
  return response.data
}


export { login, signup, getAll }