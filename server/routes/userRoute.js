import express from 'express'
import { forgotPassword, loginUser, registerUser, resetPassword, updateUser } from '../controllers/userController.js'
import userAuth from '../middleware/users/userAuth.js'
const userRoute = express.Router()

userRoute.post('/login', loginUser)
userRoute.post('/register', registerUser)
userRoute.post('/forgotPassward', forgotPassword)
userRoute.patch('/resetPassword/:token', resetPassword)
userRoute.patch('/updateUser',userAuth, updateUser)

export default userRoute

