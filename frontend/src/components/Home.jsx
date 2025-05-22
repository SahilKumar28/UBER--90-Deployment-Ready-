import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <div className="bg-[url('/images/trafficlight.jpeg')] h-128 bg-cover bg-center ">
        <img  className="w-19 ml-6 invert" src="/images/logo.png" alt="" />
      </div>
      <div className=" h-40 m-3 flex flex-col gap-8">
        <h2 className="text-2xl font-bold px-1">Get Strated With Uber</h2>
        <Link to="/login" className=" flex justify-center items-center bg-black text-white rounded-lg py-3 text-md">Continue</Link>
      </div>
    </div>
  )
}

export default Home