import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Ride } from "../../models/ride.model.js";
import crypto from "crypto"
import axios from "axios"

const calcFare = ((distance, duration) => {
    

    const base = {
        car: 30,
        moto: 20,
        auto: 15
    }

    const km = {
        car: 10,
        moto: 5,
        auto: 3
    }

    const mnt = {
        car: 20,
        moto: 10,
        auto: 5
    }

    const car_fare = (distance / 1000) * (km.car) + (duration / 60) * (mnt.car) + (base.car)
    const moto_fare = (distance / 1000) * (km.moto) + (duration / 60) * (mnt.moto) + (base.moto)
    const auto_fare = (distance / 1000) * (km.auto) + (duration / 60) * (mnt.auto) + (base.auto)
    
    
    const fare={
        car:Math.floor(car_fare),
        moto:Math.floor(moto_fare),
        auto:Math.floor(auto_fare)
    }

    return fare

})


const getFare = asyncHandler(async (req, res) => {

    try {
        const { Pickup, Destination} = req.body

        if (!Pickup || !Destination ) throw new ApiError(404, "All fields are required for creating a ride")

        
        const response = await axios.get(`http://localhost:3000/maps/info?origin=${Pickup}&destination=${Destination}&mode=driving`)
        const info = response.data.data
    
         
        const fare = calcFare(info.distance, info.duration)
        // console.log(fare)
        return res
        .status(200)
        .json(new ApiResponse(200,fare,"Fare fetched successfully"))
    } catch (error) {
        throw new ApiError(404, `Problem with generating fares,error:${error}`)
    }
})

export { getFare }