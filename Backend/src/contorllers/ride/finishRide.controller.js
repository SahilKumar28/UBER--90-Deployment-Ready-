import { Ride } from "../../models/ride.model.js";
import { sendMSG } from "../../socket.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const finishRide = asyncHandler(async (req,res)=>{
    const {passengerInfo, rideInfo, captainInfo} = req.body

    const ride = await Ride.findByIdAndUpdate(rideInfo._id,{status:"finished"})

    sendMSG(passengerInfo.socketId,{event:"finish-ride",data:{rideInfo,captainInfo}})

    return res
    .json(new ApiResponse(200,true,"Finish-event send successfully"))
})

export {finishRide}