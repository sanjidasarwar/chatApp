import express from 'express'
import { checkAuth, forgotPassword, loginUser, registerUser, resetPassword, updateUser } from '../controllers/authController.js'
import protectRoute from '../middleware/authentication/protectRoute.js'
const authRoute = express.Router()

authRoute.post('/login', loginUser)
authRoute.post('/register', registerUser)
authRoute.post('/forgotPassward', forgotPassword)
authRoute.patch('/resetPassword/:token', resetPassword)
authRoute.patch('/updateUser',protectRoute, updateUser)
authRoute.get('/checkAuth',protectRoute, checkAuth)

export default authRoute

