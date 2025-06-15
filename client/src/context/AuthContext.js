import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import axiosInstance from "../lib/axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL
export const AuthContext = createContext()

const AuthProvider =({children})=>{
    const [token, setToken] = useState(localStorage.getItem("token"))
    const[authUser, setAuthUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState(null)
    const [socket, setSocket] = useState(null)

    // check the user is authenticated or not. if so set the user data and connect the socket
    const checkAuth =async () =>{
        try {
            const response = await axiosInstance.get("/auth/checkAuth")
            if(response.success){
                setAuthUser(response.data)
                connectSocket(response.data)
            }else{
                toast.error(response.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    // handle socket connection and online user updates
    const connectSocket =(userData)=>{
        if(!userData || socket?.connected) return
        const newSocket= io(backendUrl, {
            query:{
                userId: userData._id
            }
        })

        newSocket.connect()
        setSocket(newSocket)

        newSocket.on("getOnlineUsers", (userIds)=>{
            setOnlineUsers(userIds)
        })
    }

    // login function for handle user authentication and socket connection and 
    const login =async (state, credentials)=>{
        try {
            const response = await axiosInstance.get(`/auth/${state}`, credentials)
            if(response.success){
                setAuthUser(response.data)
                connectSocket(response.data)
                axios.defaults.headers.common["token"] = response.token
                setToken(response.token)
                localStorage.setItem("token", response.token)
                toast.success(response.message)
            }else{
                toast.error(response.message)
            }

        } catch (error) {
                toast.error(error.message)
        }
    }

    // logout to handle user logout and socket disconnection
    const logout = async()=>{
        localStorage.removeItem("token")
        setToken(null)
        setAuthUser(null)
        setOnlineUsers([])
        axios.defaults.headers.common["token"] = null
        toast.success("Logged out successfully")
        socket.disconnect()

    }


    const value ={
        backendUrl,
        authUser,
        onlineUsers,
        socket,
        checkAuth,
        login,
        logout,
    }

    return(
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}

export default AuthProvider