import { useContext, useEffect, useState } from "react";
import { avator_icon } from "../../assets";
import { ChatContext } from "../../context/ChatContext";
import "./Modal.css";

function AddConverstionModal({ setIsOpen }) {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);

  const { searchUsers, users, setUsers, addConversation } =
    useContext(ChatContext);

  const handleClose = () => {
    setSearchInput("");
    setUsers([]);
    setIsOpen(false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchInput.trim()) {
        setLoading(true);
        searchUsers(searchInput).then((result) => {
          setLoading(false);
          result?.length === 0 ? setNoResult(true) : setNoResult(false);
        });
      } else {
        setLoading(false);
        setNoResult(false);
        if (setUsers) setUsers([]);
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
              onClick={handleClose}
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
                    key={user._id}
                    onClick={async () => {
                      await addConversation(user._id);
                      setSearchInput("");
                      setIsOpen(false);
                    }}
                  >
                    <img
                      src={user.profileImage ? user.profileImage : avator_icon}
                      alt="user image"
                    />
                    <span>{user.name}</span>
                  </li>
                ))}
              </ul>
              {loading && <p className="info-message">Loading...</p>}
              {!loading && noResult && (
                <p className="info-message">No users found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddConverstionModal;
