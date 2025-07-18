import express from 'express'
import { addConversation, getMessage, getUsersForSidebar, markMessageAsSeen, searchUsers, sendMessage } from '../controllers/userController.js'
import attachmentUpload from '../middleware/attachmentUpload.js'
import protectRoute from '../middleware/authentication/protectRoute.js'



const userRoute = express.Router()

userRoute.post("/add_new_user",protectRoute, addConversation)
// userRoute.delete("/delete_user/:conversationId",protectRoute, deleteConversation)
userRoute.get("/get_users",protectRoute, getUsersForSidebar)
userRoute.get("/messages/:conversationId",protectRoute, getMessage)
userRoute.post("/messages",protectRoute,attachmentUpload, sendMessage)
userRoute.put("/seen_messages/:conversationId",protectRoute, markMessageAsSeen)
userRoute.get("/search_users",protectRoute, searchUsers)


export default userRoute
