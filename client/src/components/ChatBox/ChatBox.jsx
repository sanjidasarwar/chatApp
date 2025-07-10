import { useContext, useEffect, useRef, useState } from "react";
import { arrow, avator_icon, img_attachment, profile_img } from "../../assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import "./ChatBox.css";

function ChatBox({ setShowChatBox }) {
  const [input, setInput] = useState({
    text: "",
    attachment: [],
  });
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);

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

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    const isNearBottom =
      chatContainer.scrollHeight - chatContainer.scrollTop <=
      chatContainer.clientHeight + 100;

    if (isNearBottom) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setShowScrollBtn(true);
    }
  }, [messages]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    const handleScroll = () => {
      const isNearBottom =
        chatContainer.scrollHeight - chatContainer.scrollTop <=
        chatContainer.clientHeight + 100;
      setShowScrollBtn(!isNearBottom);
    };
    chatContainer.addEventListener("scroll", handleScroll);

    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="chat-box ">
      <div className="chat-user">
        {window.innerWidth <= 768 && (
          <button
            onClick={() => setShowChatBox(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "18px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            ←
          </button>
        )}
        <img src={otherUser?.avatar ? otherUser.avatar : avator_icon} alt="" />
        <p>{otherUser?.name} </p>
        <img className="arrow" src="" alt="" />
        <img className="help" src="help" alt="" />
      </div>
      <div className="chat-msg" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={authUser.id === msg.sender.id ? "s-msg" : "r-msg"}
          >
            <div>
              <p className="msg">{msg.text}</p>
              {msg.attachment && msg.attachment.length > 0 && (
                <div className="attached-img">
                  {msg.attachment.map((imgUrl, idx) => (
                    <img key={idx} src={imgUrl} alt={`attachment-${idx}`} />
                  ))}
                </div>
              )}
            </div>
            <div>
              <img className="avator" src={profile_img} alt="" />
              <p>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
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
      {showScrollBtn && (
        <button
          className="scroll-btn"
          onClick={() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setShowScrollBtn(false);
          }}
        >
          ⬇
        </button>
      )}
    </div>
  );
}

export default ChatBox;
