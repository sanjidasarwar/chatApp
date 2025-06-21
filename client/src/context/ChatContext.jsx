import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { AuthContext } from "./AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);

  const { authUser } = useContext(AuthContext);

  const searchUsers = async (query) => {
    try {
      const { data } = await axiosInstance.get(
        `/user/search_users?user=${query}`
      );

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addConversation = async (userId) => {
    try {
      const { data } = await axiosInstance.post("/user/add_new_user", {
        id: userId,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const allConnectedUsers = async () => {
    try {
      const { data } = await axiosInstance.get("user/get_users");

      if (data.success) {
        const users = data.conversation.map((conv) => {
          const isCreator = conv.creator.id === authUser?.id;
          const otherUser = isCreator ? conv.participant : conv.creator;
          return otherUser;
        });

        setConnectedUsers(users);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (authUser) {
      allConnectedUsers();
    }
  }, [authUser]);

  const value = {
    searchUsers,
    users,
    addConversation,
    connectedUsers,
    allConnectedUsers,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
