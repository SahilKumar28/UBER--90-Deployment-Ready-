import { Server } from "socket.io"
import { User } from "./models/user.model.js";
import { Captain } from "./models/captain.model.js"
import mongoose from "mongoose";


let io;

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ['get', 'post']
        }
    })

    io.on('connection', (socket) => {
        console.log(`Client connected with id${socket.id}`)

        socket.on('join', async (data) => {
            const { clientId, clientType } = data
            if (clientType === "user") {
                await User.findByIdAndUpdate(clientId, { socketId: socket.id })
            }
            else if (clientType === "captain") {
                await User.findByIdAndUpdate(clientId, { socketId: socket.id })
                const queryId = new mongoose.Types.ObjectId(clientId);
                await Captain.findOneAndUpdate({ "personal_info._id": queryId }, { $set: { socketId: socket.id } })
            }
        })

        socket.on('updated-captain-location', async (data) => {
            const { clientId, location } = data
            const queryId = new mongoose.Types.ObjectId(clientId);
            await Captain.findOneAndUpdate({ "personal_info._id": queryId }, {
                $set: {
                    location: {
                        type: "Point",
                        coordinates: [location.lng, location.ltd] // lng, lat
                    },
                }
            })
        })

        socket.on("send-msg", (obj) => {//{id,new:hold}
            sendMSG(obj.id, { event: "rec-msg", data: obj.new })
            sendMSG(socket.id, { event: "rec-msg", data: obj.new })
        }
        )

        socket.on("disconnect", () => {
            console.log(`Client disconnected with id${socket.id}`)
        })

    })
}

function sendMSG(id, obj) {
    if (io) {
        io.to(id).emit(`${obj.event}`, obj.data)
    }
    else {
        console.log(`io not initialized`)
    }
}

export { initializeSocket, sendMSG }