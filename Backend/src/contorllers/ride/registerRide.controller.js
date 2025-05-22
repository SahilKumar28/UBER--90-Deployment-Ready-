import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Ride } from "../../models/ride.model.js";
import crypto from "crypto"
import { getCaptainsInRadius } from "../map/getCaptainsInRadius.controller.js";
import axios from "axios";
import { sendMSG } from "../../socket.js";
import { User } from "../../models/user.model.js";

const genOTP = (num) => {
    const OTP = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString()
    return OTP
}

const registerRide = asyncHandler(async (req, res) => {
    try {
        // console.log(req.body)
        const { Pickup, Destination, Fare } = req.body
        if (!Pickup || !Destination || !Fare) throw new ApiError(404, "All fields are required to register the ride")

        const ride = await Ride.create({
            user: req.user._id,
            pickup: Pickup,
            destination: Destination,
            OTP: genOTP(6),
            fare: Fare
        })
        
        const created_ride = await Ride.findById(ride._id).select("-OTP")
        if (!created_ride) throw new ApiError(404, "Promblem in final stages with creating ride")

        const response = await axios.get(`http://localhost:3000/maps/location?address=${Pickup}`)
        const ltd = response.data.data.lat
        const lng = response.data.data.lon

        const allCaptains = await  getCaptainsInRadius(ltd, lng, 50000)
    
        const passenger = await User.findById(req.user._id)
        const obj = {passengerInfo:passenger, rideInfo:created_ride}
        allCaptains.map((captain)=>{
            sendMSG(captain.socketId,{event:"offer-ride",data:obj})//First step towards socket communication
        })
        // console.log(ltd, lng, allCaptains)
        
        return res
            .status(200)
            .json(new ApiResponse(200, ride, "Ride created successfully"))

    } catch (error) {
        console.log(`Error with creating a ride:${error}`)
    }
})

export { registerRide }