import mongoose from "mongoose"

const rideSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    captain:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"captains"
        // required:true
    },
    pickup:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    fare:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending","waiting","ongoing","finished","canceled"],
        default:"pending"
    },
    duratin:{
        type:Number
    },
    distance:{
        type:Number
    },
    paymentId:{
        type:String
    },
    orderId:{
        type:String
    },
    signature:{
        type:String
    },
    OTP:{
        type:String,
        required:true,
    }
})

const Ride = mongoose.model("Ride",rideSchema)
export {Ride}