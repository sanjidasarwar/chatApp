import express from 'express'
import { forgotPassword, loginUser, registerUser } from '../controllers/userController'

const userRoute = express.Router()

userRoute.post('/login', loginUser)
userRoute.post('/register', registerUser)
userRoute.post('/forgotPassward', forgotPassword)

