import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { validationResult } from "express-validator";
import { User } from "../../models/user.model.js";

const generateTokens = async(userID)=>{
    const user = await User.findById(userID)
    const accesstoken = await user.generateAccessToken()
    const refreshtoken =await user.generateRefreshToken()
    
    user.refreshtoken=refreshtoken
    await user.save({validateBeforeSave:false})

    return {accesstoken,refreshtoken}
}

const loginUser = asyncHandler(async (req,res)=>{//do not repeat!!
    const errors = validationResult(req)

    if(!errors.isEmpty())throw new ApiError(401,"Validation failed while login.Erro:") 
 
    const {email, password} = req.body

    if(!email||!password)throw new ApiError(404,"Credentials missing while login")

    const user = await User.findOne({email:email})
    if(!user)throw new ApiError(404,"User is not registered")
    
    
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid)throw new ApiError(401,"Password is incorrect")
    

    const {accesstoken,refreshtoken}=await generateTokens(user._id)
    
    const loggedin_user=await User.findById(user._id).select("-password -refreshtoken")

    const options={
        httponly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(new ApiResponse(200,{loggedin_user,refreshtoken},"User Logged In Successfully") )
})

export {loginUser}