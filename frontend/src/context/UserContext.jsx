import React, { createContext, useEffect, useState } from "react"
const UserContext = createContext()



const UserContextProvider = ({ children }) => {

    const [user, SetUser] = useState(null)
    const [socket,setSocket] = useState("")
    return (
        <UserContext.Provider value={{ user, SetUser }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserContextProvider }
