import { createContext, useState } from "react";
import { axiosInstance } from "../lib/axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

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

  const value = {
    searchUsers,
    users,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
