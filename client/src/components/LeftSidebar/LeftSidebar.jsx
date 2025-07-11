import { useContext, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { avator_icon, logo, three_dot } from "../../assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { axiosInstance } from "../../lib/axios";
import AddConverstionModal from "./AddConverstionModal";

import "./LeftSidebar.css";

function LeftSidebar({ setShowChatBox }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const { logout, onlineUsers } = useContext(AuthContext);
  const {
    connectedConversations,
    getMessages,
    unseenMessages,
    setUnseenMessages,
    deleteConversation,
  } = useContext(ChatContext);
  const navigate = useNavigate();

  const handleConversation = async (conversationId, otherUserId) => {
    setSelectedUser(conversationId);
    getMessages(conversationId);
    setUnseenMessages((prev) => {
      const updatedUnseenMessage = { ...prev };
      delete updatedUnseenMessage[otherUserId];
      return updatedUnseenMessage;
    });

    await axiosInstance.put(`/user/seen_messages/${conversationId}`);

    if (window.innerWidth <= 768 && setShowChatBox) {
      setShowChatBox(true);
    }
  };

  const handleDelete = (e, conversationId) => {
    e.stopPropagation();

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#999",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteConversation(conversationId);
      }
    });
  };
  return (
    <>
      <div className="ls hidden">
        <div className="ls-top">
          <div className="ls-nav">
            <img className="logo" src={logo} alt="" />
            <div className="menu">
              <img src={three_dot} alt="" />
              <div className="sub-menu">
                <p onClick={() => setIsOpen(true)}>Add New</p>
                <hr />
                <p onClick={() => navigate("/profile-update")}>Edit Profile</p>
                <hr />
                <p onClick={() => logout()}>Logout</p>
              </div>
            </div>
          </div>
          {/* <div className="ls-search">
            <img src={search} alt="" />
            <input type="text" placeholder="Search.." />
          </div> */}
        </div>
        <div className="ls-list">
          {connectedConversations.map(({ conversationId, otherUser }) => (
            <div
              key={conversationId}
              className={`friends ${
                selectedUser === conversationId ? "active" : ""
              }`}
              onClick={() => handleConversation(conversationId, otherUser.id)}
            >
              <div className="flex">
                <div className="avatar">
                  <img
                    src={
                      otherUser.profileImage
                        ? otherUser.profileImage
                        : avator_icon
                    }
                    alt=""
                  />
                  <span
                    className={`status ${
                      onlineUsers.includes(otherUser.id) ? "online" : "offline"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-white">{otherUser.name}</p>

                  {unseenMessages[otherUser.id] && (
                    <p className="unseen-count">
                      {unseenMessages[otherUser.id]}
                    </p>
                  )}
                </div>
              </div>

              <span
                className="delete"
                onClick={(e) => handleDelete(e, conversationId)}
                title="Delete conversation"
              >
                <FaTrashAlt />
              </span>
            </div>
          ))}
        </div>
      </div>
      {isOpen && <AddConverstionModal setIsOpen={setIsOpen} />}
    </>
  );
}

export default LeftSidebar;
