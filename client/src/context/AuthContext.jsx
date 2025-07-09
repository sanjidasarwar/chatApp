import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // check the user is authenticated or not. if so set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axiosInstance.get("/auth/checkAuth");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      } else {
        toast.error(data.message);
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
        userId: userData.id,
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
          handleCurrentState("Login");
          return;
        }
        setAuthUser(response.data.user);
        connectSocket(response.data.user);
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        toast.success(response.data.message);
        navigate("/chat");
      } else {
        toast.error(`${state} failed`);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        toast.error(error.message);
      }
    }
  };

  // logout to handle user logout and socket disconnection
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axiosInstance.defaults.headers.common["Authorization"] = null;
    toast.success("Logged out successfully");
    navigate("/");
    if (socket) {
      socket.disconnect();
      setSocket(null); // Optional: Clear socket from state
    }
  };

  const updateUser = async (credentials) => {
    try {
      const { data } = await axiosInstance.patch(
        `/auth/updateUser`,
        credentials,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const localToken = localStorage.getItem("token");

    if (!token && localToken) {
      setToken(localToken);
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [token]);

  const value = {
    backendUrl,
    authUser,
    onlineUsers,
    socket,
    checkAuth,
    login,
    logout,
    updateUser,
    navigate,
    formErrors,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
