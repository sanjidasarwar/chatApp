import cloudinary from "cloudinary";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";

const addConversation =async (req, res) =>{
   try {
    const loggedinUserId = req.user._id
    const selectedUserId = req.body.id   
    const selectedUser = await User.findById(selectedUserId);     

    const existingConversation = await Conversation.find({
        $or:[
            {"creator.id": loggedinUserId, "participant.id": selectedUserId},
            {"creator.id": selectedUserId, "participant.id": loggedinUserId}
        ]
    })    
    
    if(existingConversation.length > 0){
        return res.status(200).json({
        message: "Conversation already exists."
      });
    }

    const newConversation = new Conversation({
        creator:{
            id: loggedinUserId,
            name: req.user.name,
            avator: req.user.avatar || null,
        },
        participant:{
            id:selectedUser._id,
            name: selectedUser.name,
            avator: selectedUser.userAvatar || null
        }
    })

    await newConversation.save();
    
    
    res.status(200).json({
      success:true,
      message: "Conversation added successfully!",
    });
   } catch (error) {
     res.json({
      success:false,
      message: error.message,
    });
   }

}


const getUsersForSidebar = async (req, res) =>{
    try {
        const loggedinUser = req.user._id
        const conversation =await Conversation.find({
            $or:[{"creator.id": loggedinUser}, {"participant.id": loggedinUser}]
        }).select("-password")             
        
        const unseenMessages ={}
        const promises = conversation.map(async (conv)=>{

            const messages = await Message.find({"receiver.id":loggedinUser, "conversation_id":conv._id,seen:false })           
            
              const otherUser = conv.creator.id.toString() === loggedinUser.toString() ? conv.participant : conv.creator;
                    
                    if (otherUser && messages.length > 0) {
                        unseenMessages[otherUser.id] = (unseenMessages[otherUser.id] || 0) + messages.length;
                    }
            
        })        

        
        
        await Promise.all(promises)

        res.json({
            success:true,
            conversation,
            unseenMessages
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
    const { text, receiverId, receiverName, avatar, conversationId } =
    req.body;
    
    const images = req.files   


    const uploadedUrls = [];

    if(images && images.length > 0){
        for (const file of images) {
        const result = await cloudinary.uploader.upload(file.path);
        console.log(result);
        
        uploadedUrls.push(result.secure_url);

        //Delete the local file after uploading to Cloudinary
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting file:", err.message);
        });
      }

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
        text:text,
        attachment: uploadedUrls,
        conversation_id:conversationId

    })

    await newMessage.save()

    // emit new message to reciver's socket
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

    const {participant, creator} = await Conversation.findById(req.params.conversationId)

    res.status(200).json({
      success:true,
      selectedConversation:{
      messages,
      participant,
      creator,
      selectedConversationId: req.params.conversationId,
      }
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
        const {conversationId} = req.params
        await Message.updateMany({"conversation_id":conversationId},  { $set: { seen: true } })
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

const searchUsers = async(req, res) =>{
    try {
        const query = req.query.user
        const loggedinUser = req.user._id

        const users =await User.find({
            _id:{ $ne: loggedinUser},
            $or:[
                {name: {$regex: query, $options:"i" }},
                {email: {$regex: query, $options:"i" }},
                {phone: {$regex: query, $options:"i" }}
            ]
        }).limit(10)
        
        res.json({
            success:true,
            users
        })
    } catch (error) {
        console.log(error.message);
        
         res.json({
            success:false,
            message: error.message
        })
    }
}

export {
    addConversation, getMessage, getUsersForSidebar, markMessageAsSeen, searchUsers, sendMessage
};

