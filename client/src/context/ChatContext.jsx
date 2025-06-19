import { createContext } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const value = {};

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
