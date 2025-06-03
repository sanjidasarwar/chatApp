import cors from "cors";
import "dotenv/config";
import express from "express";
import connectCloudinary from "./config/connectCloudinary.js";
import connectDB from "./config/mongodb.js";
import userRoute from "./routes/userRoute.js";



const app = express()
connectDB()
connectCloudinary()

const port =process.env.PORT || 8000

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// api endpoint
app.use('/user', userRoute)

app.get("/", (req, res) => {
  res.send("Api working");
});

app.listen(port, ()=>{
    console.log(`listening to port ${port}`);
    
})