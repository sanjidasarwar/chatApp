import express from 'express'
import protectRoute from '../middleware/authentication/protectRoute.js'


const userRoute = express.Router()

userRoute.get("/users",protectRoute, getUsersForSidebar)


export default userRoute
