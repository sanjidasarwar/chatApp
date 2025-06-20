import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";

function AddConverstionModal() {
  const [searchInput, setSearchInput] = useState("");
  const { searchUsers, users } = useContext(ChatContext);

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
      {/* Modal Backdrop & Centered Container */}
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        {/* Modal Box */}
        <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h5 className="text-lg font-semibold">New Conversation</h5>
            <button // your logic to close modal
              className="text-gray-500 hover:text-red-500 text-xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className="p-4">
            <form id="add-conversation-form">
              <input
                type="text"
                id="user"
                name="user"
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search user by name or email or mobile"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
            <p className="text-red-500 text-sm mt-2 error"></p>

            <div className="search_users mt-4">
              <ul>
                {users.map((user) => (
                  <li key={user.id}>
                    <img src={user.profileImage} alt="user image" />
                    <span className="ms-2">{user.name}</span>
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
