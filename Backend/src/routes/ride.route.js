import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { getFare } from "../contorllers/ride/getFare.controller.js";
import { registerRide } from "../contorllers/ride/registerRide.controller.js";
import { confirmRide } from "../contorllers/ride/confirmRide.controller.js";
import { verifyOTP } from "../contorllers/ride/verifyOTP.controller.js";
import { finishRide } from "../contorllers/ride/finishRide.controller.js";
import { getCaptainLocation } from "../contorllers/ride/getCaptainLocation.controller.js";


const rideRouter = Router()

rideRouter.route("/register").post(verifyjwt,registerRide)
rideRouter.route("/getfare").post(getFare)
rideRouter.route("/confirm").post(confirmRide)
rideRouter.route("/otp").post(verifyOTP)
rideRouter.route("/finish").post(finishRide)
rideRouter.route("/captainloc").post(getCaptainLocation)

export {rideRouter}
