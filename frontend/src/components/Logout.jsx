import React, { useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()
  useEffect(() => {

    const logout_user = async () => {
      const refreshtoken = localStorage.getItem("refreshtoken")
      await axios.post(`${import.meta.env.VITE_BASE_URL}/users/logout`, {}, { headers: { Authorization: `Bearer ${refreshtoken}` } })
        .then((response) => {
          // console.log("hello")
          if (response.status === 200) {
            localStorage.removeItem("refreshtoken")
            localStorage.removeItem("user")
            navigate("/login")
          }
        })
    }
   logout_user()
  }, [navigate])


  return (
    <div>Logout</div>
  )
}

export default Logout