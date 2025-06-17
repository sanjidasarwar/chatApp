import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
    attachment: [
      {
        type: String,
      },
    ],
    seen:{
        type:Boolean,
        default:false
    },
    sender: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    receiver: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    conversation_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
