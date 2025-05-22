import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import axios from "axios"

const getSuggestion = asyncHandler(async (req,res)=>{
    const {address} = req.query

    if(!address)throw new ApiError(404,"No address founded")

     const response = await axios.get("https://nominatim.openstreetmap.org/search",{
        params:{
            q:address,
            format:"json",
            addressdetails:1,
            limit:5
        },
        headers:{
          "User-Agent":"leafletdemo/1.0 (sahilmukeshkumar01@gmail.com)"
        }
    })
   
    const suggestions = response.data.map((place)=>(place.display_name.split(/[^A-Za-z0-9\s,.-;]+/)[0].trim()))


    return res
    .status(200)
    .json(new ApiResponse(200,suggestions,"Suggestions Fetched Successfully"))
})

export {getSuggestion}