import crypto from 'crypto';
import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    name:{type:String, require:true},
    email:{type:String, require:true, unique: true},
    password:{type:String, require:true},
    passwordResetToken:String,
    passwordResetTokenExpiry:Date
},{timestamps:true})

// Add method to generate reset token
userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpiry = Date.now() + 3600000; // 1 hour
  
  return resetToken;
};


const UserModel = mongoose.models.user || mongoose.model("user", userSchema)

export default UserModel