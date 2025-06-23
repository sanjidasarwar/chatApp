import { useContext, useState } from "react";
import { arrow, img_attachment, profile_img } from "../../assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import "./ChatBox.css";

function ChatBox() {
  const [input, setInput] = useState({
    text: "",
    attachment: [],
  });

  const { selectedConversations, sendMessage } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);

  const messages = selectedConversations?.messages || [];
  const participant = selectedConversations?.participant || null;
  const creator = selectedConversations?.creator || null;
  const selectedConversationId =
    selectedConversations?.selectedConversationId || null;

  const isCreator = authUser?.id == creator?.id ? true : false;
  const otherUser = isCreator ? participant : creator;

  const handleTextChange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   const newImages = [...input.attachment];

  //   setInput((prev) => ({
  //     ...prev,
  //     attachment: newImages,
  //   }));
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      message: input,
      receiverId: participant.id,
      receiverName: participant.name,
      avatar: participant.avatar,
      conversationId: selectedConversationId,
    };
    sendMessage(data);
    setInput({
      text: "",
      attachment: [],
    });
  };

  // console.log(selectedConversations);

  return (
    <div className="chat-box ">
      <div className="chat-user">
        <img src={otherUser?.avatar} alt="" />
        <p>{otherUser?.name} </p>
        <img className="arrow" src="" alt="" />
        <img className="help" src="help" alt="" />
      </div>
      <div className="chat-msg">
        <div className="s-msg">
          <p className="msg">Lorem ipsum dolor sit amet...</p>
          <div>
            <img src={profile_img} alt="" />
            <p>2.30 PM</p>
          </div>
        </div>
        <div className="r-msg">
          <p className="msg">Lorem ipsum dolor sit amet...</p>
          <div>
            <img src={profile_img} alt="" />
            <p>3.30 PM</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="chat-input">
          <input
            type="text"
            name="text"
            onChange={(e) => handleTextChange(e)}
            placeholder="Send a message"
          />
          <input type="file" id="attachment" name="attachment" hidden />
          <label htmlFor="attachment">
            <img src={img_attachment} alt="" />
          </label>
          <img src={arrow} alt="" />
        </div>
      </form>
    </div>
  );
}

export default ChatBox;
