import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { User } from "../../models/user.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import {validationResult} from "express-validator"

const registerUser=asyncHandler(async(req,res)=>{
    
    const errors = validationResult(req)
    if(!errors.isEmpty())throw new ApiError(404,"Validation Request Failed,errors:",errors)

    const {fullname, email, password} = req.body
    const {firstname, lastname} = fullname
    
    if(!fullname?.firstname || !email || !password)throw new ApiError(404,"A mandatary field is missing")
   
    const existedUser = await User.findOne({
        $or:[ {"fullname.firstname":fullname.firstname}, {email:email} ]
    })

    if(existedUser)throw new ApiError(401,"The user already exists")
       
    const user = await User.create({
          fullname:{
            firstname,
            lastname
          },
          email,
          password,
          refreshtoken:"",
          socketId:""
    })
  
    const createdUser = await User.findById(user._id).select("-password -refreshtoken")
    if(!createdUser)throw new ApiError(404,"Problem with registering the user")
      
    return res
    .status(201)
    .json(new ApiResponse(201,createdUser,"User Registered Successfully"))
})

export {registerUser}