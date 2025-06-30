import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logo, search, three_dot } from "../../assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import AddConverstionModal from "./AddConverstionModal";
import "./LeftSidebar.css";

function LeftSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, onlineUsers } = useContext(AuthContext);
  const { connectedConversations, getMessages, unseenMessages } =
    useContext(ChatContext);
  const navigate = useNavigate();

  return (
    <>
      <div className="ls hidden">
        <div className="ls-top">
          <div className="ls-nav">
            <img className="logo" src={logo} alt="" />
            <div className="menu">
              <img src={three_dot} alt="" />
              <div className="sub-menu">
                <p onClick={() => navigate("/profile-update")}>Edit Profile</p>
                <hr />
                <p onClick={() => logout()}>Logout</p>
              </div>
            </div>
          </div>
          <div className="ls-search">
            <img src={search} alt="" />
            <input type="text" placeholder="Search.." />
          </div>
          <div>
            <button onClick={() => setIsOpen(true)}>
              Add New Conversation
            </button>
          </div>
        </div>
        <div className="ls-list">
          {connectedConversations.map(({ conversationId, otherUser }) => (
            <div
              key={conversationId}
              className="friends"
              onClick={() => getMessages(conversationId)}
            >
              <img src={otherUser.profileImage} alt="" />
              <div>
                <p className="text-white">{otherUser.name}</p>
                {onlineUsers.includes(otherUser.id) ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-neutral text-xs">Offline</span>
                )}
                <span>{unseenMessages[otherUser.id]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isOpen && <AddConverstionModal />}
    </>
  );
}

export default LeftSidebar;
