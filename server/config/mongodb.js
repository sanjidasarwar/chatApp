import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/chatApp`);
        console.log("MongoDB connected");        
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }

}

export default connectDB;