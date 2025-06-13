import express from 'express'
import { forgotPassword, loginUser, registerUser, resetPassword, updateUser } from '../controllers/authController.js'
import userAuth from '../middleware/users/userAuth.js'
const authRoute = express.Router()

authRoute.post('/login', loginUser)
authRoute.post('/register', registerUser)
authRoute.post('/forgotPassward', forgotPassword)
authRoute.patch('/resetPassword/:token', resetPassword)
authRoute.patch('/updateUser',userAuth, updateUser)

export default authRoute

