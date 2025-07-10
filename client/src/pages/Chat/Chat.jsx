import { useContext, useEffect, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import NoChatSelected from "../../components/NoChatSelected/NoChatSelected";
import { ChatContext } from "../../context/ChatContext";
import "./Chat.css";

function Chat() {
  const { selectedConversations } = useContext(ChatContext);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showChatBox, setShowChatBox] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobileView && selectedConversations.length > 0) {
      setShowChatBox(true);
    }
  }, [selectedConversations, isMobileView]);

  return (
    <div className="chat">
      <div className="chat-container">
        {!isMobileView || !showChatBox ? (
          <LeftSidebar setShowChatBox={setShowChatBox} />
        ) : null}
        {selectedConversations.length === 0 ? (
          <NoChatSelected />
        ) : (
          <ChatBox setShowChatBox={setShowChatBox} />
        )}
      </div>
    </div>
  );
}

export default Chat;
