import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [connectedConversations, setConnectedConversations] = useState([]);
  const [selectedConversations, setSelectedConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState([]);

  // const messages = selectedConversations?.messages || [];
  const participant = selectedConversations?.participant || null;
  const creator = selectedConversations?.creator || null;
  const selectedConversationId =
    selectedConversations?.selectedConversationId || null;

  const { authUser, socket } = useContext(AuthContext);

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
      if (data.success) {
        await allConnectedUsers();
        toast.success(data.message);
      }
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
          return {
            otherUser,
            conversationId: conv._id,
          };
        });

        setConnectedConversations(users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getMessages = async (conversationId) => {
    try {
      const { data } = await axiosInstance.get(
        `/user/messages/${conversationId}`
      );

      if (data.success) {
        setSelectedConversations(data.selectedConversation);
        setMessages(data.selectedConversation.messages);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const sendMessage = async (credentials) => {
    try {
      const { data } = await axiosInstance.post("user/messages", credentials, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.success) {
        setMessages((preMsg) => [...preMsg, data.newMessage]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const subscribeToMessages = async () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (participant && participant.id === newMessage.sender.id) {
        newMessage.seen = true;
        setMessages((preMsg) => [...preMsg, newMessage]);

        axiosInstance.put(`user/seen_messages/${newMessage._id}`);
      } else {
        setUnseenMessages((preUnseenMessages) => ({
          preUnseenMessages,
          [newMessage.sender.id]: preUnseenMessages[newMessage.sender.id]
            ? preUnseenMessages[newMessage.sender.id] + 1
            : 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    if (authUser) {
      allConnectedUsers();
    }
  }, [authUser]);

  useEffect(() => {
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [participant, socket]);

  const value = {
    searchUsers,
    users,
    setUsers,
    addConversation,
    connectedConversations,
    allConnectedUsers,
    getMessages,
    selectedConversations,
    sendMessage,
    messages,
    participant,
    creator,
    selectedConversationId,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
