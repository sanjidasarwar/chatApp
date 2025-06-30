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

  const {
    messages,
    participant,
    creator,
    selectedConversationId,
    sendMessage,
  } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);

  const isCreator = authUser?.id == creator?.id ? true : false;
  const otherUser = isCreator ? participant : creator;

  const handleTextChange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;

    if (!files) return;

    setInput((prev) => ({
      ...prev,
      attachment: [...prev.attachment, ...files],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", input.text);
    formData.append("receiverId", otherUser.id);
    formData.append("receiverName", otherUser.name);
    formData.append("avatar", otherUser.avatar);
    formData.append("conversationId", selectedConversationId);

    input.attachment.forEach((file) => {
      formData.append("attachments", file);
    });

    sendMessage(formData);
    setInput({
      text: "",
      attachment: [],
    });
  };

  return (
    <div className="chat-box ">
      <div className="chat-user">
        <img src={otherUser?.avatar} alt="" />
        <p>{otherUser?.name} </p>
        <img className="arrow" src="" alt="" />
        <img className="help" src="help" alt="" />
      </div>
      <div className="chat-msg">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={authUser.id === msg.sender.id ? "s-msg" : "r-msg"}
          >
            <p className="msg">{msg.text}</p>
            {msg.attachment && msg.attachment.length > 0 && (
              <div>
                {msg.attachment.map((imgUrl, idx) => (
                  <img key={idx} src={imgUrl} alt={`attachment-${idx}`} />
                ))}
              </div>
            )}
            <div>
              <img src={profile_img} alt="" />
              <p>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="chat-input">
          <input
            type="text"
            name="text"
            value={input.text}
            onChange={(e) => handleTextChange(e)}
            placeholder="Send a message"
          />
          <input
            type="file"
            id="attachments"
            name="attachments"
            multiple
            hidden
            onChange={(e) => handleImageUpload(e)}
          />
          <label htmlFor="attachments">
            <img src={img_attachment} alt="" />
          </label>
          <img src={arrow} alt="" onClick={(e) => handleSubmit(e)} />
        </div>
      </form>
    </div>
  );
}

export default ChatBox;
