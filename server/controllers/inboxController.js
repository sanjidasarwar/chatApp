const Conversation = require("../models/Conversation.js")

const addConversation =async (req, res) =>{
   try {
     const loggedinUser = req.userId
    const selectedUser = req.body.id

    const existingConversation = await Conversation.find({
        $or:[
            {"creator.id": loggedinUser, "participant.id": selectedUser},
            {"creator.id": selectedUser, "participant.id": loggedinUser}
        ]
    })
    
    if(existingConversation){
        res.status(200).json({
        message: "Conversation already exists.",
        conversationId: existingConversation._id,
      });
    }

    const newConversation = new Conversation({
        creator:{
            id: loggedinUser,
            name: req.userName,
            avator: req.userAvator || null,
        },
        participant:{
            id:selectedUser,
            name: req.body.userName,
            avator: req.body.userAvator || null
        }
    })

    await newConversation.save();
    res.status(200).json({
      success:true,
      message: "Conversation was added successfully!",
    });
   } catch (error) {
     res.json({
      success:false,
      message: error.message,
    });
   }

}

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