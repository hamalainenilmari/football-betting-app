import Notification from "./Notification"
import { useEffect, useState } from "react"
import { login, signup } from "../services/userManagement"

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [newUserUsername, setNewUserUsername] = useState('')
    const [newUserPassword, setNewUserPassword] = useState('')
    const [user, setUser] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    // eslint-disable-next-line no-unused-vars
    let token = null

    const setToken = newToken => {
    token = `Bearer ${newToken}`
    }

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
        setErrorMessage('Incorrect username or password')
        setTimeout( () => {
        setErrorMessage(null)
        }, 5000)
    }
    console.log('logging in with', username, password)
    }

    const handleSignup = async (event) => {
    event.preventDefault()

    try {
        const user = await signup({
        username: newUserUsername,
        password: newUserPassword
        })
        window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
        )
        setToken(user.token)
        setUser(user)
        setNewUserPassword('')
        setNewUserUsername('')
    } catch (exception) {
        setErrorMessage('Error signing up')
        setTimeout( () => {
        setErrorMessage(null)
        }, 5000)
    }
    console.log('logging in with', username, password)
    }

    const logout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    }


    const loginForm = () => {
    return (
        <form onSubmit={handleLogin}>
        <div>
            <h2>log in to application</h2>
            <Notification message={errorMessage} />
            username
            <input
            data-testid='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
            password
            <input
            data-testid='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type="submit">login</button>
        </form>
    )
    }

    const signupForm = () => {
    return (
        <form onSubmit={handleSignup}>
        <div>
            <Notification message={errorMessage} />
            newUserUsername
            <input
            data-testid='newUserUsername'
            type="text"
            value={newUserUsername}
            name="Username"
            onChange={({ target }) => setNewUserUsername(target.value)}
            />
        </div>
        <div>
            newUserPassword
            <input
            data-testid='newUserPassword'
            type="password"
            value={newUserPassword}
            name="Password"
            onChange={({ target }) => setNewUserPassword(target.value)}
            />
        </div>
        <button type="submit">Sign up</button>
        </form>
    )
    }

   if (user) {
    return (
        <div>
        moi {user.name}
        <p><button id="logout" onClick={logout}>logout</button></p>
        </div>
    )
    } else {
    return (
        <div>
        <h1> Betti äppi</h1>
        {loginForm()}
        <p></p>
        Luo käyttäjä
        {signupForm()}
        </div>
    )
    
}
}
export default Login