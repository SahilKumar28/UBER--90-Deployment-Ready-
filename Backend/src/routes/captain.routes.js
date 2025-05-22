import {Router} from "express"
import {body} from "express-validator"
import { verifyjwt } from "../middlewares/auth.middleware.js"
import { registerCaptain } from "../contorllers/captain/register.controller.js"
import { check_captainism } from "../contorllers/captain/check_captainism.controller.js"


const captainRouter = Router()

captainRouter.route("/register").post(
    [
        body('vehicle.color').isLength({min:3}).withMessage('color must be atleast 3 characters long'),
        body('vehicle.plate').isLength({min:3}).withMessage('plate must be atleast 3 characters long'),
        body('vehicle.capacity').isLength({min:1}).withMessage('capacity must be atleast 1')
    ],

    verifyjwt,
    registerCaptain

)

captainRouter.route("/check").get(verifyjwt, check_captainism)

export {captainRouter}