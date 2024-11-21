import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js"
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary_FileUpload.js";
import {ApiResponse} from "../utils/apiResponse.js";
import bcrypt from 'bcrypt';
import  jwt  from "jsonwebtoken";

const userRegister = asyncHandler(async (req,res)=>{
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
  const createdUser= await User.findById(user._id).select("-password -refreshToken");
  console.log("User details of DB" + " " + createdUser);
  if(!createdUser) {
    throw new ApiError(500,"Something went wrong , user not registered in Db")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
  )

})
const createAccessandRefreshToken= async (UserId) =>{
  try {
    const user =  await User.findById(UserId)
    // console.log("UserID" + user)
    // Generating both the tokens
    const refresh_token = await user.generateAccessTokens();
    const access_token = await user.generateRefreshTokens();
  //  console.log("Refresh Token"  + refresh_token )
   console.log("Access TokenAJ"  + access_token )
    //Saving  refresh Token IN DB
    user.refreshToken = refresh_token;
    try {
     
    // console.log("UserID" + user)
    await user.save()
    // console.log("Refresg token befoe returning " +  refresh_token)
    // return {refresh_token,access_token}
    return { refreshToken: refresh_token, accessToken: access_token };

    
    }
    catch(error) {
      console.error("Error in createAccessandRefreshToken:", error);
      throw new ApiError(500, "Something went wrong while creating access or refresh token")
    }
    
    
  }
  catch(error) {
    console.log("erris is" + error)
    throw new ApiError(500,"Something went wrong while creating access or refresh token")
  }

}
const loggInUser = asyncHandler(async (req,res)=>{

  // req.data se value 
  // check username or email in db
  //if present then check password
  //generate refresh and access token
  //store refresh token in database
  // create cookies and send it to frontEnd 
   const {userName, fullName,email,password} = req.body ;
   console.log("logged in details" + req.body.email )
  const User_searchbyEmailOrUserName = await User.findOne({$or:[{email:email},{userName:userName}]});
  
  if(!User_searchbyEmailOrUserName) {
    throw new ApiError(404,"Invalid credentials")
  }
  if(!password) {
    throw new ApiError(404,"PassWord Not entered")
  }
  // console.log("password is" +password + " " + User_searchbyEmailOrUserName.password )
   const isPassWordMatched = bcrypt.compare(password,User_searchbyEmailOrUserName.password);

   if(!isPassWordMatched) {
    throw new ApiError(401,"Please enter the correct passsword")
   }
   const UserId = User_searchbyEmailOrUserName._id;
   const {refreshToken,accessToken}=await createAccessandRefreshToken(UserId);
   console.log("Refersh Token is" + refreshToken)

   const loggedInUser  = User.findById(UserId).select("-password -refreshToken")
   const options = 
   {
    httpOnly:true,
    secure:true
   }

   return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
   
})

const logOutTheUser  = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
        $unset: {
            refreshToken: 1 // this removes the field from document
        }
    },
    {
        new: true
    }
)

const options = {
    httpOnly: true,
    secure: true
}

return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new ApiResponse(200, {}, "User logged Out"))


})

const refreshTheAccessToken = asyncHandler(async(req,res)=>{
  try {
  const refreshFromFronENd = req.cookies.refreshToken || req.body.refreshToken;
 
const decodedToken=jwt.verify(refreshFromFronENd,process.env.SUPER_SECRET);
if(!decodedToken) {
throw new ApiError(401,"Mismatch of keys Unautotized access")
}
const userForRefreshFromBackendSaved = await User.findById(decodedToken.id)
if(!userForRefreshFromBackendSaved) {
  throw new ApiError(401,"Invalid User Token")
}
// console.log( "Saved Refresh Token from backend is" + " " +userForRefreshFromBackendSaved )
// console.log( "Saved Refresh Token from FrontEnd is" + " " +refreshFromFronENd )
if(userForRefreshFromBackendSaved.refreshToken !=refreshFromFronENd) {
  throw new ApiError(401,"User token is expired or used")
}
const options = {
  httpOnly: true,
  secure: true
}

const {accessToken, refreshToken} = await createAccessandRefreshToken(userForRefreshFromBackendSaved._id)

return res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
  new ApiResponse(
      200, 
      {accessToken, refreshToken: refreshToken},
      "Access token refreshed"
  )
)
}
 catch (error) {
throw new ApiError(401, error?.message || "Invalid refresh token")
}
})

export default userRegister ;
export {loggInUser,logOutTheUser,refreshTheAccessToken};