import React from 'react'
import { useContext, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const ProtectedWrapper = ({ children }) => {

  const refreshtoken = localStorage.getItem("refreshtoken")
  const navigate = useNavigate()

  useEffect(() => {
    if (!refreshtoken) {
      navigate("/login")
    }
  }, [refreshtoken])//use effect ke bina kyun nhi chala aur useEffect ke sath kyun chala ye sawal-bhai mujhse render karne dedo phir main navigate
//karta hun

  return (
    <div>{children}</div>
  )
}

export default ProtectedWrapper