//this component checks if the registered_as_captain is true or not.
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

const Captain_check = ({ children }) => {


    const navigate = useNavigate()
    
    const refreshtoken = localStorage.getItem("refreshtoken")
    useEffect(() => {
        const get_response = async () => {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/check`,{ headers: { Authorization: `Bearer ${refreshtoken}` } })
                if(!response.data.data){
                    navigate("/captainregister")
                }
        
        }
        get_response()
    }, [])


    return (
        <div>{children}</div>
    )
}

export default Captain_check