import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
    {
     fullname:{
        firstname:{
            type:String,
            required:true,
            minLength:[3,"The minimum length of the fullname should be 3"]
        },
        lastname:{
            type:String,
            required:true,
            minLength:[3,"The minimum length of the lastname should be 3"]
        }
     },
     email:{
        type:String,
        required:true,
        minLength:3
     },
    password:{
        type:String,
        required:true,
        minLength:3,
    },
    socketId:{
        type:String
    },
    refreshtoken:{
        type:String,
    },
    role:{
        type:String,
        enum:['user', 'captain'],
        default:"user"
    },
    registered_as_captain:{
        type:Boolean,
        enum:[true,false],
        default:false
    }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return 

    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            firstname:this.fullname.firstname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            firstname:this.fullname.firstname
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}

const User = mongoose.model("User",userSchema)
export {User}