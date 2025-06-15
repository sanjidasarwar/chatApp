import express from 'express'
import { addConversation, getMessage, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/inboxController.js'
import protectRoute from '../middleware/authentication/protectRoute.js'


const userRoute = express.Router()

userRoute.post("/add_new_user",protectRoute, addConversation)
userRoute.get("/users",protectRoute, getUsersForSidebar)
userRoute.get("/messages/:conversationId",protectRoute, getMessage)
userRoute.post("/messages/",protectRoute, sendMessage)
userRoute.post("/messages/",protectRoute, markMessageAsSeen)


export default userRoute
