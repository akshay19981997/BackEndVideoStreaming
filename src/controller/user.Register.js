import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js"
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary_FileUpload.js";
import {ApiResponse} from "../utils/apiResponse.js";

const userRegister = asyncHandler(async (req,res,next)=>{
    // res.status(200).json({
    //     message:"ok"
    // })
    const {fullName,email,userName,password} = req.body;
     console.log("email is" + email);

     if([fullName,email,userName,password].some((elem)=>{
       elem.trim() == ""   
     })
     ) {
       throw new ApiError(400,"All fields are required")
     }
  const result=await User.findOne({$or:[{email},{userName}]});
  if(result){{
    throw new ApiError(409,"User with Email or given username already present, pls try with different credentials")
  }}
   console.log(req.file);
  const AvataarFilePAth=req.files?.avatar[0]?.path
  const CoverImagePAth=req.files?.coverImage[0]?.path

  if(!AvataarFilePAth) {
    throw new ApiError(400,"Upload Avataar");
  }

  const avataar = await uploadOnCloudinary(AvataarFilePAth);
  const coverImage = await uploadOnCloudinary(CoverImagePAth);
console.log("Avatar returned from cloudnary upload" + " " + avataar)
if (!avataar) {
  throw new ApiError(400, "Avatar file is required")
}
 const user = await User.create({
    userName,
    email,
    fullName,
    password,
    avatar:avataar.url,
    coverImage:coverImage?.url || ""
  })
    console.log("User id" + user._id)
  const createdUser= await User.findById(user._id).select("-password");
  console.log("User details of DB" + " " + createdUser);
  if(!createdUser) {
    throw new ApiError(500,"Something went wrong , user not registered in Db")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
  )

})

export default userRegister;