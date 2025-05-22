import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getUserprofile = asyncHandler(async(req,res)=>{
   
    const user = await User.findById(req.user._id).select("-password -refreshtoken")
   
    return res
   .status(200)
   .json(new ApiResponse(200,user,"User profile fetched successfully"))
})

export {getUserprofile}