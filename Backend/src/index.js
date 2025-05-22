import dotenv from "dotenv"
dotenv.config({ path: './.env' })
import { connectDB } from "./db/connection.js"
import { app } from "./app.js"

//7-10 sets the websocket
import http from "http"
import { initializeSocket,sendMSG } from "./socket.js"
const server = http.createServer(app)
initializeSocket(server)

const port= process.env.PORT || 3000

connectDB()
.then( ()=>{
   app.listen(port, ()=>{
    console.log("Listening to the port successfully")
   }) 
} )
.catch( (error)=>{
    console.log("Error with connecting the server:",error)
} )

server.listen(port, () => {
  console.log("Listening to the WebSocketConnetion successfully")
})

