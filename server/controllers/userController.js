import Conversation from "../models/Conversation.js"
import Message from "../models/Message.js"
import { io, userSocketMap } from "../server.js"

const addConversation =async (req, res) =>{
   try {
     const loggedinUser = req.user._id
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
            name: req.user.name,
            avator: req.user.avatar || null,
        },
        participant:{
            id:selectedUser,
            name: req.body.userName,
            avator: req.body.userAvatar || null
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
        const loggedinUser = req.user._id
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

const sendMessage = async (req, res) =>{
   try {
    const { message, receiverId, receiverName, avatar, conversationId } =
    req.body;
    

    let imageUrl;
    if(avatar){
        const upload = cloudinary.uploader.upload(avatar)
        imageUrl=upload.secure_url
    }

    const newMessage = await new Message({
        sender:{
            id:req.user._id,
            name: req.user.name,
            avator: req.user.avatar || null,
        },
        receiver:{
            id:receiverId,
            name: receiverName,
            avator: avatar || null,
        },
        text:message,
        attachment: imageUrl,
        conversation_id:conversationId

    })

    const receiverSocketId = userSocketMap[receiverId]
    if(receiverSocketId){
        io.to(receiverSocketId).emit('newMessage', newMessage)
    }

    res.json({
        success:true,
        newMessage
    })
   } catch (error) {
     res.json({
        success:false,
        message:error.message
    })
   }

}

const getMessage = async (req, res) =>{
   try {
     const messages = await Message.find({
        "conversation_id" : req.params.conversationId
    })

    const {participant} = await Conversation.findById(req.params.conversationId)
    res.status(200).json({
      success:true,
      data: {
        messages,
        participant,
      },
      user: req.user,
      selectedConversationId: req.params.conversationId,
    });
   } catch (error) {
    res.json({
        success:false,
        message: error.message
    })
   }
}

const markMessageAsSeen = async(req, res) =>{
    try {
        const {id} = req.params
        await Message.findByIdAndUpdate(id, {seen:true})
        res.json({
            success:true
        })
        
    } catch (error) {
        res.json({
            success:false,
            message: error.message
         })
    }
}

export {
    addConversation, getMessage, getUsersForSidebar, markMessageAsSeen, sendMessage
}
