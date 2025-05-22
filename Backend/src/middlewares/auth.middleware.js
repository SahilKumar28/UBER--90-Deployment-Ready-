import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const verifyjwt = asyncHandler(async(req,res,next)=>{
   
   try {
    const refreshtoken = req.cookies?.refreshtoken || req.headers.authorization?.split(' ')[1]
    if(!refreshtoken)throw new ApiError(404,"Unauthrized Request")
 
   const decoded_token = jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET)
   const user = await User.findById(decoded_token._id)
 
   if(!user)throw new ApiError(404,"Unauthrized Request")
 
   req.user = user
   } catch (error) {
    console.log("Problem with auth verification:",error)
   }

   next()
})

export {verifyjwt}