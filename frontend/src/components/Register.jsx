import React from 'react'
import axios from "axios"
import { Link, useNavigate } from 'react-router-dom'
import { useState,useContext,useEffect } from 'react'
import { UserContext } from '../context/UserContext'

const Register = () => {

  const { user, SetUser } = useContext(UserContext)
  const navigate = useNavigate()


  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  

  //data ki value is getting updated but not immediately
  const submitHandler = async (e) => {
    e.preventDefault()
    const user_data = { fullname: { firstname: firstname, lastname: lastname }, email: email, password: password }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, user_data)

    if (response.status === 201) {
      navigate("/login")
    }
    setEmail("")
    setPassword("")
    setFirstname("")
    setLastname("")
  }
  return (
    <div className="h-screen w-full " >
      <img src="/images/logo.png" alt="" className='w-19 ml-6' />
      <form action="" className='px-10 mt-5 flex flex-col gap-3' onSubmit={(e) => submitHandler(e)}>

        <h3 className="text-2xl text-black font-semibold">What's Your Name</h3>
        <div className="flex gap-3 ">
          <input type="text" required placeholder='Firstname' value={firstname} onChange={(e) => setFirstname(e.target.value)}
            className='placeholder-gray-400 px-3 py-1 w-1/2 bg-gray-200 rounded-md' />
          <input type="text" required placeholder='Lastname' value={lastname} onChange={(e) => setLastname(e.target.value)}
            className='placeholder-gray-400 px-3 py-1 w-1/2  bg-gray-200 rounded-md' />
        </div>

        <h3 className="text-2xl text-black font-semibold">What's Your Email</h3>
        <input type="email" required placeholder='email@exmaple.com' value={email} onChange={(e) => setEmail(e.target.value)}
          className='placeholder-gray-400 px-3 py-1 w-full bg-gray-200 rounded-md' />

        <h3 className="text-2xl mt-3 text-black font-semibold">What's Your Password</h3>
        <input type="password" required placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}
          className='placeholder-gray-400 px-3 py-1 w-full bg-gray-200 rounded-md' />


        <button className="text-white rounded-xl text-lg text-center px-4 py-1 bg-black mt-4 ">Register</button>

        <p className='font-bold text-center'>Already have an account? <Link to="/login" className=" font-semibold text-blue-500">Click here</Link> </p>

      </form>
    </div>
  )
}

export default Register