import express from 'express'
import { forgotPassword, loginUser, registerUser, resetPassword } from '../controllers/userController.js'

const userRoute = express.Router()

userRoute.post('/login', loginUser)
userRoute.post('/register', registerUser)
userRoute.post('/forgotPassward', forgotPassword)
userRoute.patch('/resetPassword/:token', resetPassword)

export default userRoute

