import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import "./Modal.css";

function AddConverstionModal() {
  const [searchInput, setSearchInput] = useState("");
  const { searchUsers, users, addConversation } = useContext(ChatContext);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchInput.trim()) {
        searchUsers(searchInput);
      } else {
        console.log("no user found");
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-box">
          <div className="modal-header">
            <h5 className="modal-title">New Conversation</h5>
            <button
              className="modal-close"
              aria-label="Close"
              // your logic to close modal
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <form id="add-conversation-form">
              <input
                type="text"
                id="user"
                name="user"
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search user by name or email or mobile"
                className="modal-input"
              />
            </form>
            <p className="error-message"></p>
            <div className="search-users">
              <ul>
                {users.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => {
                      addConversation(user._id);
                    }}
                  >
                    <img src={user.profileImage} alt="user image" />
                    <span>{user.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddConverstionModal;
