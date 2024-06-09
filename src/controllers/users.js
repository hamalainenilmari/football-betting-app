import { hash } from 'bcrypt'
import { Router as usersRouter } from 'express'
//const usersRouter = require('express').Router()
import User from '../models/user'

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

export default usersRouter