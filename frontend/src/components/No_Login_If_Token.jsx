import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const No_Login_If_Token = ({children}) => {
     const navigate = useNavigate()
    const refreshtoken = localStorage.getItem("refreshtoken")
  useEffect(()=>{
    if(refreshtoken){
        navigate("/start")
    }
  },[])

  return (
    <div>{children}</div>
  )
}

export default No_Login_If_Token