import cors from "cors";
import "dotenv/config";
import express from "express";
import http from 'http';
import { Server } from "socket.io";
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./config/mongodb.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";


const app = express()
connectDB()
connectCloudinary()

const port =process.env.PORT || 8000
const server = http.createServer(app)

// initialize socket io server
export const io = new Server(server, {
   cors: {origin:"*"},
})

//store online users
export const userSocketMap ={}

// socket io connection handler
io.on('connection', (socket)=>{
  const userId = socket.handshake.query.userId
  console.log("user connected:", userId);
  if(userId){
    userSocketMap[userId]= socket.id
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  socket.on('disconnect', ()=>{
    console.log("user disconnected:", userId);
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

  })
  
})

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URI,
  credentials: true,
  transports: ['websocket'],
}))

// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://chatapp-597g.onrender.com' 
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));

// api endpoint
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)

app.get("/", (req, res) => {
  res.send("Api working");
});

server.listen(port, ()=>{
    console.log(`listening to port ${port}`);
    
})