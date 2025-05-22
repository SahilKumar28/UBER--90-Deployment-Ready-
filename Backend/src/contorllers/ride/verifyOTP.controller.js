import { Captain } from "../../models/captain.model.js";
import { Ride } from "../../models/ride.model.js";
import { sendMSG } from "../../socket.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const verifyOTP = asyncHandler(async (req, res) => {

    const {OTP, passengerInfo, rideInfo, captainInfo} = req.body
    const ride = await Ride.findByIdAndUpdate(rideInfo._id)

    if (OTP !== ride.OTP) {
        return res
            .json(new ApiResponse(200, false, "OTP Mismatched"))
    }

    ride.status = "ongoing"
    ride.save()

    const captain = await Captain.findById(captainInfo._id)//as  the captain in localstorage has no socketId

    sendMSG(passengerInfo.socketId,{event:"start-ride",data:{rideInfo, captain}})//this gives us access to socketId of captain once the ride has begin
    sendMSG(captain.socketId,{event:"start-ride",data:{rideInfo, passengerInfo}})
    
    return res
    .json(new ApiResponse(200,true,"OTP MATCHED"))

    
})

export { verifyOTP }