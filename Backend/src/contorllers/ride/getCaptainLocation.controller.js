import { Captain } from "../../models/captain.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getCaptainLocation = asyncHandler(async(req,res)=>{

    try {
        const {id} = req.body
        console.log("received",id)
    
        const captain = await Captain.findById(id)
        // console.log(captain.location.coordinates)
    
        return res
        .json(new ApiResponse(200,captain.location.coordinates,"Captain Cordinates fetched Successfully"))
    } catch (error) {
        console.log(error)
    }
})

export {getCaptainLocation}