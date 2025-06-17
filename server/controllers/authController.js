import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import crypto from 'crypto';
import fs from "fs";
import jwt from "jsonwebtoken";
import validator from "validator";
import UserModel from "../models/User.js";
import sendEmail from "../utilites/email.js";

const loginUser =async (req, res) =>{
try {
    const {userName, password} = req.body

    const user = await UserModel.findOne({
        $or:[{email: userName}, {name: userName}]
    })

    if(!user){
        return res.status(500).json({
            success:false,
            message:"Login failed! Please enter a valid username"
        })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    
    if(!validPassword){
        return res.status(500).json({
            success:false,
            message:"Login failed! Please enter a valid password"
        })
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    })
    

    res.status(200).json({
        success:true,
        message:"Login Sucessful",
        user,
        token
    })

} catch (error) {
    console.log(error);
    
      res.status(500).json({
        success:false,
        message:`Error=> ${error.message}`
        })
}
}

const registerUser = async (req, res)=>{
    try {
        const {name, userName, password} = req.body
        
        const existUser = await UserModel.findOne({email: userName})

        if(existUser){
             return res.json({ success:false, message: "User already exist" });
        }

        if(!validator.isEmail(userName)){
             return res.json({ success:false, message: "Please enter a valid email" });
        }

        const strongPassword= validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })

        if(!strongPassword){
            return res.json({ success:false, message: "Please enter a strong password" });
        }

        // hashing password
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new UserModel({
            name,
            email:userName,
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
    try {
        const {email} = req.body
        const user =await UserModel.findOne({email: email})

        if(!user){
            res.status(404).json({
                success:false,
                message:"Please enter a valid email"
            })
        }

        // generate random reset token
        const resetToken = user.createResetPasswordToken()
        await user.save()

        // send the token back to the user email
        const resetUrl = `${req.protocol}://${req.get('host')}/user/resetPassword/${resetToken}`        

        const message = `<p>You requested a password reset</p>
             <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
             <p>This reset password link will valid only for 10 minutes</p>`
        
        try {
            await sendEmail({
                email,
                subject:"Password change request received",
                message
            })
            res.status(200).json({ success: true, message: "Reset link sent to your email" });

        } catch (error) {            
            user.passwordResetToken=undefined
            user.passwordResetTokenExpiry=undefined
            user.save()
            res.status(500).json({
                message: "There was an error sending password reset email. Please try again later"
            })
        }
        

    } catch (error) {
           res.status(500).json({
                success:false,
                message:`Error=> ${error.message}`
            })
    }
}

const resetPassword = async (req, res) =>{
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await UserModel.findOne({passwordResetToken:token, passwordResetTokenExpiry: {$gt:Date.now()}})

    if(!user){
           res.status(500).json({
                success:false,
                message:"Token is invalid or has expired"
            })
    }

    user.password = user.password = await bcrypt.hash(req.body.password, 10);
    user.passwordResetToken = undefined
    user.passwordResetTokenExpiry = undefined
    user.passwordChangedAt = Date.now()

    user.save()

    const newToken = jwt.sign(user._id, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    })

    res.status(200).json({
        success:true,
        message:"Login Sucessful",
        newToken
    })
}

const updateUser = async(req, res) =>{
    try {
        const {name, previousPassword, password} = req.body
        const userId = req.user._id
        console.log(userId);
        
        const user = await UserModel.findById(userId)
        const matchPreviousPassword = await bcrypt.compare(previousPassword, user.password)

        let updatedFields ={name}

        if (password && previousPassword) {
            if(!matchPreviousPassword){
                return res.status(400).json({
                    success: false,
                    message: "Previous password does not match",
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedFields.password = hashedPassword
        }

        if(req.file){
            const upload =await cloudinary.uploader.upload(req.file.path,  {
                folder: "avatars",
                public_id: `user_${userId}`,
                overwrite: true,
            })
            
            updatedFields.profileImage = upload.secure_url

            //Delete the local file after uploading to Cloudinary
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting file:", err.message);
            });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
                                userId,
                                updatedFields,
                                { new: true }
                            );

        res.json({
            success:true,
            user:updatedUser
        })
    } catch (error) {
        console.log(error.message);
         res.json({
            success:false,
            message:error.message
         })
        
    }

}

const checkAuth = async(req, res)=>{
    try {
        res.status(200).json({
            success:true,
            data: req.user
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:'Internal server error'})
    }
}

export {
    checkAuth, forgotPassword, loginUser,
    registerUser, resetPassword, updateUser
};

