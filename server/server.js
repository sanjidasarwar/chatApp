import cors from "cors";
import "dotenv/config";
import express from "express";
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./config/mongodb.js";
import authRoute from "./routes/authRoute.js";



const app = express()
connectDB()
connectCloudinary()

const port =process.env.PORT || 8000

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// api endpoint
app.use('/api/auth', authRoute)
app.use('/api/inbox', authRoute)

app.get("/", (req, res) => {
  res.send("Api working");
});

app.listen(port, ()=>{
    console.log(`listening to port ${port}`);
    
})