import React,{createContext,useEffect} from "react";
import { io } from "socket.io-client"

const SocketContext = createContext()

const socket = io(`${import.meta.env.VITE_BASE_URL}`)

const SocketContextProvider = ({children})=>{
    // console.log('inside socket')
    useEffect(()=>{
        socket.on('connect',()=>{
            console.log("Connexted to server")
        })

        socket.on('disconnect',()=>{
            console.log("Disconnected to server")
    })
    },[])

    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}

export{SocketContext,SocketContextProvider}