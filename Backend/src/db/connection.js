import mongoose from "mongoose"

const connectDB = async ()=>{
   try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
    console.log("DB connection successfull")
   } catch (error) {
    console.log("Error with connecting the database:",error)
   }
}

export {connectDB}