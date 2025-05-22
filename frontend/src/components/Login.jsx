import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import axios from "axios"

const Login = () => {
  const { user, SetUser } = useContext(UserContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  //data ki value is getting updated but not immediately
  const submitHandler = async (e) => {
    e.preventDefault()
    const user_data = { email: email, password: password }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, user_data)
    if (response.status === 200) {
      // console.log(response.data.data.loggedin_user)
      SetUser(response.data.data.loggedin_user)
      localStorage.setItem("refreshtoken", response.data.data.refreshtoken)
      localStorage.setItem("user",JSON.stringify(response.data.data.loggedin_user))
    }
    setEmail("")
    setPassword("")
  }
  
  useEffect(()=>{
    if(user && user._id)
       navigate("/start")
  },[user])
 
  return (
    <div className="h-screen w-full " >
      <img src="/images/logo.png" alt="" className='w-19 ml-6' />
      <form action="" className='px-10 mt-5 flex flex-col gap-3' onSubmit={(e) => submitHandler(e)}>
        <h3 className="text-2xl text-black font-semibold">What's Your Email</h3>
        <input type="email" required placeholder='email@exmaple.com' value={email} onChange={(e) => setEmail(e.target.value)}
          className='placeholder-gray-400 px-3 py-1 w-full bg-gray-200 rounded-md' />

        <h3 className="text-2xl mt-3 text-black font-semibold">What's Your Password</h3>
        <input type="password" required placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}
          className='placeholder-gray-400 px-3 py-1 w-full bg-gray-200 rounded-md' />


        <button className="text-white rounded-xl text-lg px-4 py-1 bg-black mt-4 ">Login</button>

        <p className='font-bold text-center'>New Here? <Link to="/register" className=" font-semibold text-blue-500">Create New Account</Link> </p>

      </form>
    </div>
  )
}

export default Login