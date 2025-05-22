import React, { createContext, useState } from "react";
const ChatContext = createContext()

const ChatContextProvider = ({ children }) => {

    const obj = {
        white: {
            overall: "fixed w-full h-screen bg-white z-10",
            user: "flex  justify-end px-5 py-1 bg-gray-400 mt-5 rounded-2xl w-[70vw] ml-auto text-white",
            captain: "flex px-5 bg-blue-400 mt-5 rounded-2xl w-[70vw] mr-auto text-white",
            input:"placeholder-black"
        },
        black: {
            overall: "fixed w-full h-screen bg-zinc-800 text-gray-100 z-10",
            user: "flex  justify-end px-5 py-1 bg-gray-400 mt-5 rounded-2xl w-[70vw] ml-auto text-white",
            captain: "flex px-5 bg-blue-400 mt-5 rounded-2xl w-[70vw] mr-auto text-white",
            input:"placeholder-black text-black"
        }
    }

    const [Messages, setMessages] = useState([])
    const [newMessage, setnewMessage] = useState("")
    const [DarkMode, setDarkMode] = useState(false)
    const [Overall, setOverall] = useState(obj.white.overall)
    const [Userli, setUserli] = useState(obj.white.user)
    const [Captainli, setCaptainli] = useState(obj.white.captain)
    const [Input, setInput] = useState("placeholder-black")

    return (
        <ChatContext.Provider value={ {obj, Messages, setMessages, newMessage, setnewMessage, DarkMode, setDarkMode, Overall, setOverall, Userli, setUserli, Captainli, setCaptainli,Input, setInput}}>
            {children}
        </ChatContext.Provider>
    )

}

export { ChatContextProvider, ChatContext }