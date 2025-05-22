import React,{Children, createContext,useState} from "react";
const CaptainContext = createContext()

const CaptainContextProvider = ({children})=>{

    const [captain,setCaptain] = useState(null)
    return(
        <CaptainContext.Provider value={{captain,setCaptain}}>
          {children}
        </CaptainContext.Provider>
    )

}

export {CaptainContextProvider,CaptainContext}