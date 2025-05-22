import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
    origin:process.env.ORIGIN
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


import { userRouter } from "./routes/user.routes.js"
import { captainRouter } from "./routes/captain.routes.js"
import { mapRouter } from "./routes/map.routes.js"
import { rideRouter } from "./routes/ride.route.js"

app.use("/users",userRouter)
app.use("/captains",captainRouter)
app.use("/maps",mapRouter)
app.use("/rides",rideRouter)
export {app}