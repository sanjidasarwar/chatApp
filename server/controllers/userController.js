import bcrypt from "bcrypt";
import validator from "validator";
import UserModel from "../models/User.js";

const loginUser =async (req, res) =>{

}

const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body
    const existUser = await UserModel.findOne({email: email})
    if(existUser){
        res.json({
            success:false,
            message: "User already exist"
        })
    }

    if(!validator.isEmail(email)){
        res.json({
            success:false,
            message: "Please enter a valid email"
        })
    }

    const strongPassword= validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })

    if(!strongPassword){
        res.json({
            success:false,
            message: "Please enter a strong password"
        })
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new UserModel({
        name,
        email,
        password:hashedPassword
    })

    await newUser.save()
        res.status(200).json({
            success:true,
            message:"User was added successfully!"
        })
    } catch (error) {
        res.status(500).json({
        success:false,
        message:`Error=> ${error.message}`
        })
    }
}

const forgotPassword = async (req, res) =>{

}

export {
    forgotPassword, loginUser,
    registerUser
};

