import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Video } from "./video.model.js";
const userSchema = new mongoose.Schema({
   userName : {
    type:String,
    required:true,
    lowercase:true,
    trim:true,
    unique:true,
    index:true
   },
   email : {
    type:String,
    required:true,
    lowercase:true,
    trim:true,
    unique:true,
    index:true
   },
   fullName : {
    type:String,
    required:true,
    lowercase:true,
    trim:true
   },
   password : {
    type:String,
    required:true,
    lowercase:true,
    trim:true
   },
   avatar : {
    type:String,
    required:true,
   },
   coverImage : {
    type:String,
    required:true,
   },
   refreshToken : {
    type:String
   },
   watchHistory : [
    {
        type:Schema.ObjectId,
        ref :Video
    }
   ]
})

userSchema.pre("save",async function (next){

    if(!this.isModified("password")) return this.next() 

    this.password= bcrypt.hash("this.password",10);
    next()

})

userSchema.methods.generateAccessTokens = async function () {
    return jwt.sign({
     id:this.id,
     fullName:this.fullName,
     userName:this.userName,
     email:this.email

    },process.env.access_token,{
        expiresIn : process.env.access_token_expiry
    })
}

userSchema.methods.generateRefreshTokens = async function () {
    return jwt.sign({
     id:this.id
    },process.env.refresh_token,{
        expiresIn : process.env.refresh_token_expiry
    })
}
export const User  = mongoose.model("User",userSchema);