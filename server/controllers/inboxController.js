const Conversation = require("../models/Conversation.js")

const getUsersForSidebar = async (res, req) =>{
    try {
        const loggedinUser = req.userId
        const addedUser =await Conversation.find({
            $or:[{"creator.id": loggedinUser}, {"participant.id": loggedinUser}]
        })
        res.json({
            success:true,
            addedUser
        })
    } catch (error) {
         res.json({
            success:false,
            message: error.message
        })
    }
    
}

module.exports={
getUsersForSidebar,

}