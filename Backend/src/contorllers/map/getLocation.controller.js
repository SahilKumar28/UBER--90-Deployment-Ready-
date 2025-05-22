import express from "express"
import axios from "axios"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"

const getLocation = asyncHandler(async (req, res) => {
    
    const { address } = req.query
    if (!address) throw new ApiError(404, "No address detected")

    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search',
            {
                params: {
                    q: address,
                    format: "json",
                    limit: 1
                },
                headers: {
                    'user-agent': "leaflet-demo/1.0"
                }
            }
        )
        if(!response.data || response.data.length===0){
            throw new ApiError(404,"No response detected")
        }
        
        return res
            .status(200)
            .json(new ApiResponse(200, response.data[0], "Fetched Successfully"))
        
    } catch (error) {
        throw new ApiError(404,`some error occured:${error}`)
    }



})

export { getLocation }