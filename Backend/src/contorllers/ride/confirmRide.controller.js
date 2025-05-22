import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendMSG } from "../../socket.js";
import { Ride } from "../../models/ride.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Captain } from "../../models/captain.model.js";

const confirmRide = asyncHandler(async(req,res)=>{
    // console.log("received confirmation")
    const {passengerInfo, rideInfo, captainInfo} = req.body
    // console.log("Backend:",captainInfo)
    const updated_rideInfo = await Ride.findByIdAndUpdate(rideInfo._id,{status:"waiting"})//OTP Ke liye+pending ko waiting karna

    const updated_captainInfo = await Captain.findById(captainInfo._id)//socketID DEDI, pehle nhi thi
    
    sendMSG(passengerInfo.socketId,{event:"confirm-ride",data:{rideInfo:updated_rideInfo,captainInfo:updated_captainInfo}})

    return res
    .json(new ApiResponse(200,true,"Confirm Event Send Successfully"))
})

export {confirmRide}