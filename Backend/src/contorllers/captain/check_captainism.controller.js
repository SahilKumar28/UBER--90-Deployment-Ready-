import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";

const check_captainism = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id)
    if(!user)throw new ApiError(404,"No user exists")
    
    const is_Captain = user.registered_as_captain

    return res
    .status(201)
    .json(new ApiResponse(201,is_Captain,"fetched successfully"))
})

export {check_captainism}