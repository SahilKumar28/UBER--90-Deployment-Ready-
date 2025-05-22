import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { Captain } from "../../models/captain.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { validationResult } from "express-validator"
import { User } from "../../models/user.model.js"

const registerCaptain = asyncHandler(async (req, res) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) throw new ApiError(404, "Validation Request Failed While Registering Captain,errors:", errors)

  const { vehicle } = req.body
  const { color, plate, capacity, vehicle_type } = vehicle

  if (!color || !plate || !capacity || !vehicle_type) throw new ApiError(404, "A mandatary field is missing")

  const existedCaptain = await Captain.findOne({
    $or: [{ email: req.user.email }]
  })

  if (existedCaptain) throw new ApiError(401, "The user already exists")

  await User.findByIdAndUpdate(req.user._id, { $set: { role: "captain" } })

  const user_details = await User.findById(req.user._id).select("-socketId -refreshtoken")
  const captain = await Captain.create({
    personal_info: user_details,
    vehicle: {
      color,
      plate,
      capacity,
      vehicle_type
    },
    socketId: "",
    location: {
      type: "Point",
      coordinates: [0,0] 
    }
  })

  const createdCaptain = await Captain.findById(captain._id)
  if (!createdCaptain) throw new ApiError(404, "Problem with registering the user")

  await User.findByIdAndUpdate(createdCaptain.personal_info, { registered_as_captain: true })

  return res
    .status(201)
    .json(new ApiResponse(201, createdCaptain, "Captain Registered Successfully"))
})

export { registerCaptain }