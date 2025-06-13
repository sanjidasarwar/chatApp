import jwt from "jsonwebtoken";

const protectRoute =(req, res, next)=>{
  const { token } = req.headers;
    
  try {
    if(!token){
        return res.json({
            success: false,
            message: "Please login",
        });
    }

    const decoded_token= jwt.varify(token, process.env.JWT_SECRET)
    req.userId = decoded_token.id
    req.userName = decoded_token.name
    req.userAvatar = decoded_token.avatar

    next()
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export default protectRoute;
