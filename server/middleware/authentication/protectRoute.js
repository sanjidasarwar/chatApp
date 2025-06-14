import jwt from "jsonwebtoken";
import UserModel from "../../models/User";

const protectRoute =async (req, res, next)=>{
  const { token } = req.headers;
    
  try {
    if(!token){
        return res.json({
            success: false,
            message: "Please login",
        });
    }

    const decoded_token= jwt.varify(token, process.env.JWT_SECRET)

    const user = await UserModel.findById(decoded_token.id).select("-password")

    req.user = user

    next()
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export default protectRoute;
