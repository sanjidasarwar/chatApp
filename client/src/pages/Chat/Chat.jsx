import { useContext } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import NoChatSelected from "../../components/NoChatSelected/NoChatSelected";
import { ChatContext } from "../../context/ChatContext";
import "./Chat.css";

function Chat() {
  const { selectedConversations } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chat-container">
        <LeftSidebar />
        {selectedConversations.length === 0 ? <NoChatSelected /> : <ChatBox />}
      </div>
    </div>
  );
}

export default Chat;
