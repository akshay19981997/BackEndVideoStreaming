import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js";
import  jwt  from "jsonwebtoken";
// import dotenv from "dotenv"
// dotenv.config();
export const jwtTokensAuth = asyncHandler(async function (req,res,next){

    try {
        console.log("Req detail " + req);
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("Token is " +token)
        const tokenParts = token.split('.');
        console.log("Token parts:", tokenParts);
    if(!token) {
        throw new ApiError(401,"Unauthrised Request")
    }
    console.log("During verify JWT SIGN" + " "+ process.env.SUPER_SECRET)
    // console.log("Process details" + process.env.access_token)
    const decodedToken =  jwt.verify(token, process.env.SUPER_SECRET)
       console.log("Decoded Token is" + decodedToken);
       if(!decodedToken) console.log("Tken not decoded")
        const user = await User.findById(decodedToken?.id).select("-password -refreshToken")
    
        if (!user) {
            console.log(`this is the issue point `)
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    }
    catch(error) { 
        throw new ApiError(401, error?.message || " user test Invalid access token")
    }

    

})