import jwt from "jsonwebtoken";
import UserModel from "../../models/User.js";

const protectRoute =async (req, res, next)=>{
  
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  
    
  try {
    if(!authHeader  || !authHeader.startsWith("Bearer ")){
        return res.json({
            success: false,
            message: "Please login",
        });
    }

    const token = authHeader.split(" ")[1];
    const decoded_token= jwt.verify(token, process.env.JWT_SECRET)

    const user = await UserModel.findById(decoded_token.id).select("-password")

    req.user = user
    next()
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export default protectRoute;
