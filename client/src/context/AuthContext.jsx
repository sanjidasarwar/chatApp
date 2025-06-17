import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [socket, setSocket] = useState(null);

  // check the user is authenticated or not. if so set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get("/auth/checkAuth");
      if (response.success) {
        setAuthUser(response.data);
        connectSocket(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // handle socket connection and online user updates
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  // login function for handle user authentication and socket connection and
  const login = async (state, credentials, handleCurrentState) => {
    try {
      const response = await axiosInstance.post(`/auth/${state}`, credentials);

      if (response.data.success) {
        if (state === "register") {
          toast.success(response.data.message);
          handleCurrentState("login");
          return;
        }
        setAuthUser(response.data.user);
        connectSocket(response.data.user);
        axios.defaults.headers.common["token"] = response.data.token;
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(response.data.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // logout to handle user logout and socket disconnection
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
    socket.disconnect();
  };

  const updateUser = async (credentials) => {
    try {
      const { data } = await axiosInstance.patch(
        `/auth/updateUser`,
        credentials,
        {
          headers: { token, "Content-Type": "multipart/form-data" },
        }
      );
      console.log(data);

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    backendUrl,
    authUser,
    onlineUsers,
    socket,
    checkAuth,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
