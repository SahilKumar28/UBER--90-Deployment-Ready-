import mongoose from "mongoose"

const captainSchema = new mongoose.Schema(
    {
        personal_info: {
            type: Object,
            required: true
        },

        vehicle: {
            color: {
                type: String,
                required: true,
                minLength: [3, "Minimum length of the color should be 3"]
            },
            plate: {
                type: String,
                required: true,
                minLength: [3, "Minimum length of the plate should be 3"]
            },
            capacity: {
                type: Number,
                required: true,
                minLength: [1, "Minimum capacity should be 1"]
            },
            vehicle_type: {
                type: String,
                required: true,
                enum: ['car', 'vehicle', 'auto']
            }
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },
        socketId: {
            type: String
        }
    }
)

captainSchema.index({ location: "2dsphere" });
const Captain = mongoose.model("Captain", captainSchema)
export { Captain }