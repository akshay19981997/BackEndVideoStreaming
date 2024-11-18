import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js";
import  jwt  from "jsonwebtoken";
export const jwtTokensAuth = asyncHandler(async function (req,res,next){

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if(!token) {
        throw new ApiError(401,"Unauthrised Request")
    }
    const decodedToken = jwt.verify(token, process.env.access_token)
       console.log("Decoded Token is" + decodedToken);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    }
    catch(error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

    

})