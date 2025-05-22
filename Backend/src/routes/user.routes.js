import {Router} from "express"
import {body} from "express-validator"
import { verifyjwt } from "../middlewares/auth.middleware.js"

import { registerUser } from "../contorllers/user/register.controller.js"
import { loginUser } from "../contorllers/user/login.controller.js"
import { getUserprofile } from "../contorllers/user/getuserprofile.controller.js"
import { logoutuser } from "../contorllers/user/logout.controller.js"

const userRouter = Router()

userRouter.route("/register").post(
    [
    body('email').isEmail().withMessage('Invalid Email'),
     body('fullname.firstname').isLength({min:3}).withMessage('Firstname must be atleast 3 characters long'),
     body('password').isLength({min:3}).withMessage('Password must be atleast 3 characters long'),
    ],
    registerUser
)

userRouter.route("/login").post(
    [
        body('email').isEmail().withMessage("Invalid Email"),
        body('password').isLength({min:3}).withMessage('Password must be atleast 3 characters long')
    ],
    loginUser

)

userRouter.route("/getprofile").get(verifyjwt,getUserprofile)

userRouter.route("/logout").post(verifyjwt,logoutuser)

export {userRouter}