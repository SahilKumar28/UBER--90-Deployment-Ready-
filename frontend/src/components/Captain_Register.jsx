import React from 'react'
import axios from "axios"
import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../context/UserContext'

const Register = () => {

  const { user, SetUser } = useContext(UserContext)
  const navigate = useNavigate()

  const refreshtoken = localStorage.getItem("refreshtoken")

  const [color, setColor] = useState("")
  const [plate, setPlate] = useState("")
  const [capacity, setCapacity] = useState("")
  const [vehicle_type, setVehicle_type] = useState("")


  //data ki value is getting updated but not immediately
  const submitHandler = async (e) => {
    e.preventDefault()
    const vehicle_data = {vehicle:{ color: color, plate: plate , capacity: capacity, vehicle_type: vehicle_type }}
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, vehicle_data,{ headers: { Authorization: `Bearer ${refreshtoken}` } })

    if (response.status === 201) {
      localStorage.setItem("captain",JSON.stringify(response.data.data))
      navigate("/captain")
    }
    setColor("")
    setPlate("")
    setCapacity("")
    setVehicle_type("")
  }
  return (
    <div className="h-screen w-full " >
      <img src="/images/logo.png" alt="" className='w-19 ml-6' />
      <form action="" className='px-10 mt-5 flex flex-col gap-3' onSubmit={(e) => submitHandler(e)}>

        <h3 className="text-3xl text-black font-bold p-2 ">Vehicle Information</h3>
        <div className="flex flex-col gap-7 ">

          <div className='flex gap-4'>
            <input type="text" required placeholder='color' value={color} onChange={(e) => setColor(e.target.value)}
              className='placeholder-gray-400 px-3 py-1 w-1/2 bg-gray-200 rounded-md' />
            <input type="text" required placeholder='plate no' value={plate} onChange={(e) => setPlate(e.target.value)}
              className='placeholder-gray-400 px-3 py-1 w-1/2  bg-gray-200 rounded-md' />
          </div>

          <div className='flex gap-4'>
            <input type="text" required placeholder='capacity' value={capacity} onChange={(e) => setCapacity(e.target.value)}
              className='placeholder-gray-400 px-3 py-1 w-1/2  bg-gray-200 rounded-md' />
            <input type="text" required placeholder='vehicle_type' value={vehicle_type} onChange={(e) => setVehicle_type(e.target.value)}
              className='placeholder-gray-400 px-3 py-1 w-1/2  bg-gray-200 rounded-md' />
          </div>
        </div>


        <button className="text-white rounded-xl text-lg text-center px-4 py-1 bg-black mt-4 ">Register</button>

      </form>
    </div>
  )
}

export default Register