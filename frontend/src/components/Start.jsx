import React, { useState, useRef, useEffect, useContext } from 'react'
import { useGSAP } from "@gsap/react"
import gsap from 'gsap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../context/UserContext'
import { SocketContext } from '../context/SocketContext'
import { Chat } from './Chat'
import { ChatContext } from '../context/ChatContext'
import { LiveTracking } from '../liveTracking/LiveTracking'



const Start = () => {

  const navigate = useNavigate()



  const [Suggestions, setSuggestions] = useState([])
  const [ActivePlace, setActivePlace] = useState("Place")
  const [Prices, setPrices] = useState({ car: 0, moto: 0, auto: 0 })

  const [ActivePanel, setActivePanel] = useState("start")
  const [Pickup, setPickup] = useState("")
  const [Destination, setDestination] = useState("")
  const [LocationPanel, setLocationPanel] = useState(false)
  const [VehiclePanel, setVehiclePanel] = useState(false)
  const [ConfirmPanel, setConfirmPanel] = useState(false)
  const [LookingPanel, setLookingPanel] = useState(false)
  const [WaitingPanel, setWaitingPanel] = useState(false)
  const [RidingPanel, setRidingPanel] = useState(false)
  const [ChattingPanel, setChattingPanel] = useState(false)
  const [Notification, setNotification] = useState(0)


  const [Offer, setOffer] = useState(null)//start main offer matlab ride confirmed, captain main offer matlab ride requested
  const StartRef = useRef(null)
  const LocationRef = useRef(null)
  const VehicleRef = useRef(null)
  const ConfirmRef = useRef(null)
  const LookingRef = useRef(null)
  const WaitingRef = useRef(null)
  const RidingRef = useRef(null)
  const ChattingRef = useRef(null)

  // ConfirmPanel-Related Variables
  const [Img, setImg] = useState("/images/car.png")
  const [FinalPrice, setFinalPrice] = useState(0)
  const refreshtoken = localStorage.getItem("refreshtoken")
  //ends here

  const { user, SetUser } = useContext(UserContext)
  const { socket } = useContext(SocketContext)
  const { setMessages } = useContext(ChatContext)



  // useGSAP(() => {
  //   const handler = setTimeout(async () => {
  //     const response = await axios.get(`http://localhost:3000/maps/suggestion?address=${Pickup}`)
  //     setSuggestions(response.data.data)
  //   }, 2500)
  // }, [Pickup])


  useEffect(() => {
    const stored_user = JSON.parse(localStorage.getItem("user"))
    SetUser(stored_user)//bad main kam ajayega)
    socket.emit("join", { clientType: "user", clientId: stored_user._id })

    socket.on("confirm-ride", (data) => {
      setOffer(data)
      // console.log("datahere:",data)
      setActivePanel("WaitingPanel")
      setWaitingPanel(true)
      setLocationPanel(false)
    })

    socket.on("start-ride", (data) => {
      // console.log(data.captain,data.rideInfo)//captainInfo was updated to captain to access the socketId afterwards
      setOffer(data)
      setActivePanel("RidingPanel")
      setRidingPanel(true)
      setWaitingPanel(false)
    })

    socket.on("finish-ride", (data) => {
      //data is ride-info and captain-info
      setActivePanel("start")
      setRidingPanel(false)
      setPickup("")
      setDestination("")
      gsap.from(StartRef.current, { bottom: "-100%" })
      gsap.to(StartRef.current, { bottom: "0%", duration: 0.5, ease: "power2.out" })
    })

    const messageHandler = (obj) => {
      setMessages((prev) => ([...prev, obj]))
      setNotification((prev) => (prev + 1))
    }

    socket.on("rec-msg", messageHandler)
    

    return () => {
      socket.off("rec-msg", messageHandler)
    }


  }, [])

  useGSAP(() => {
    gsap.from(StartRef.current, { bottom: "-100%" })
  }, [])

  useGSAP(() => {
    if (LocationPanel) {
      gsap.to(StartRef.current, { bottom: "65%" })
      gsap.to(LocationRef.current, { top: "35%", height: "65vh" })
    }
    else {
      gsap.to(StartRef.current, { bottom: "0" })
    }
  }, [LocationPanel])

  useGSAP(() => {
    if (VehiclePanel) {
      gsap.from(VehicleRef.current, { bottom: "-100%" })
      // gsap.to(VehicleRef.current, { height: "60vh" })
      gsap.to(StartRef.current, { bottom: "-100%" })
    }
    else {
      gsap.to(VehicleRef.current, { bottom: "-100%" })
    }
  }, [VehiclePanel])

  useGSAP(() => {
    if (ConfirmPanel) {
      gsap.from(ConfirmRef.current, { bottom: "-100%" })
      // gsap.to(ConfirmRef.current, { height: "80vh" })
    }
    else {
      gsap.to(ConfirmRef.current, { bottom: "-100%" })
    }
  }, [ConfirmPanel])

  useGSAP(() => {
    if (LookingPanel) {
      gsap.from(LookingRef.current, { bottom: "-100%" })
      // gsap.to(LookingRef.current, { height: "65%" })
    }
    else {
      gsap.to(LookingRef.current, { bottom: "-100%" })
    }
  }, [LookingPanel])

  useGSAP(() => {
    if (WaitingPanel) {
      gsap.from(WaitingRef.current, { bottom: "-100%" })
      // gsap.to(WaitingRef.current, { height: "65vh" })
    }
    else {
      gsap.to(WaitingRef.current, { bottom: "-100%" })
    }
  }, [WaitingPanel])

  useGSAP(() => {
    if (RidingPanel) {
      gsap.from(RidingRef.current, { bottom: "-100%" })
      // gsap.to(WaitingRef.current, { height: "65vh" })
    }
    else {
      console.log("false hogaya")
      gsap.to(RidingRef.current, { bottom: "-100%" })
    }
  }, [RidingPanel])

  useGSAP(() => {
    if (ChattingPanel) {
      // console.log("true hogaya")
      gsap.from(ChattingRef.current, { bottom: "-100%" })
    }
    else {
      gsap.to(ChattingRef.current, { bottom: "-100%" })
    }
  }, [ChattingPanel])

  const submitHandler = (e) => {
    e.preventDefault()
  }

  const stored_user = JSON.parse(localStorage.getItem("user"))

  return (

    <div className='overflow-hidden relative'>

      {ActivePanel === "RidingPanel" ?
        (
          <div className='w-full h-screen fixed z-0'>
            <LiveTracking local_captain={Offer.captain} />
          </div>
        )
        :
        (<div className=" bg-[url('/images/map.jpg')] w-full h-screen fixed">
          <img src="/images/logo.png " className="w-19 ml-6" alt="" />
        </div>)
      }


      {/* firstportion */}
      <div className={`fixed bottom-0 w-full `} ref={StartRef}>
        {/* 30% Fixed Panel */}
        <div className="p-4 h-[35vh] bg-white">
          <form onSubmit={(e) => submitHandler(e)} className="flex flex-col gap-3">

            <div className="flex justify-between items-center">
              <h3 className="font-bold text-2xl">Find a trip</h3>
              <div className="flex items-center gap-1">
                <img src="/images/down.svg" className={`w-5 ${(ActivePanel === "LocationPanel") ? "opacity-100" : "opacity-0"}`}
                  onClick={() => { setLocationPanel(false), setActivePanel("start") }} />

                <img
                  src="/images/captain.png"
                  className="w-12 mb-1"
                  alt="Captain"
                  onClick={() => navigate("/captain")}
                />
              </div>
            </div>

            <input
              type="text"
              placeholder="Add a pickup location"
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  if (Pickup.trim() !== "") {
                    const response = await axios.get(`http://localhost:3000/maps/suggestion?address=${Pickup}`)
                    setSuggestions(response.data.data)
                  }
                }
              }
              }
              value={Pickup}
              onChange={(e) => setPickup(e.target.value)}
              onClick={() => { setActivePanel("LocationPanel"); setLocationPanel(true); setActivePlace("Pickup") }}
              className="bg-[#eee] w-full px-3 py-2 text-xl font-semibold text-black rounded-2xl"
            />


            <input
              type="text"
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  if (Destination.trim() !== "") {
                    const response = await axios.get(`http://localhost:3000/maps/suggestion?address=${Destination}`)
                    setSuggestions(response.data.data)
                  }
                }
              }
              }
              placeholder="Enter your destination"
              value={Destination}
              onChange={(e) => setDestination(e.target.value)}
              onClick={() => { setActivePanel("LocationPanel"); setLocationPanel(true); setActivePlace("Destination") }}
              className="bg-[#eee] w-full px-3 py-2 text-xl font-semibold text-black rounded-2xl"
            />

            <button className='bg-black text-white text-center font-semibold rounded-lg px-3 py-1'

              onClick={async () => {
                if (!Pickup || !Destination) {
                  setPickup("")
                  setDestination("")
                }
                else {
                  const travel_data = { Pickup: Pickup, Destination: Destination }
                  console.log(travel_data)
                  const response = await axios.post("http://localhost:3000/rides/getfare", travel_data)
                  setPrices(response.data.data)
                  setActivePanel("VehiclePanel")
                  setVehiclePanel(true)
                  setLocationPanel(false)
                }
              }}
            >Find the offers</button>
          </form>
          <div className="text-xs text-gray-500 text-center select-none mt-2 bg-white">
            Search powered by <a href="https://nominatim.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="underline">Nominatim</a> / <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a> contributors
          </div>
        </div>



      </div>


      {/* second portion */}
      {ActivePanel === "LocationPanel" &&
        (<div className='fixed w-full bottom-0 bg-white' ref={LocationRef}>
          {
            Suggestions.length > 0 &&
            (
              <ul>
                {Suggestions.map((Suggestion, index) => (
                  <li className='flex content-center items-center gap-3 bg-white p-2' key={index}
                    onClick={() => {
                      ActivePlace === "Pickup" ? setPickup(Suggestion) : setDestination(Suggestion)
                    }}
                  >
                    <img src="/images/location.png" className='w-8 bg-[#eeee] rounded-2xl p-1' alt="" />
                    <h3 className='font-semibold text-md'> {Suggestion}</h3>
                  </li>
                ))}
              </ul>
            )
          }
        </div>)
      }


      {/* Third Portion */}
      {ActivePanel === "VehiclePanel" && (
        <div className='fixed bottom-0  bg-white w-full h-auto ' ref={VehicleRef}>
          <div className='flex justify-between items-center content-center px-2'>
            <h3 className='font-bold text-2xl p-2'>Choose a vehicle</h3>
            <img src="/images/down.svg" className='w-5' alt=""
              // onClick={() => { setActivePanel("LocationPanel"); setLocationPanel(true), setVehiclePanel(false) }} />
              onClick={() => { gsap.to(VehicleRef.current, { bottom: "-100%", duration: 0.2, ease: "Power2.inout", onComplete: () => { setActivePanel("LocationPanel"); setVehiclePanel(false), setLocationPanel(true) } }) }} />

          </div>
          <div className='p-3'>

            <div className='flex flex-col gap-4'>
              <div className='flex justify-between gap-4 p-2 items-center border border-[#d2caca] rounded-2xl'
                onClick={() => { setImg("/images/car.png"); setFinalPrice(Prices.car); gsap.to(VehicleRef.current, { bottom: "-100%", duration: 0.2, ease: "Power2.inout", onComplete: () => { setActivePanel("ConfirmPanel"); setVehiclePanel(false), setConfirmPanel(true) } }) }}>
                <img src="/images/car.png" className='w-24 h-auto' alt="" />
                <div className="flex flex-col gap-1">
                  <div className='flex items-center gap-2'>
                    <div className='text-sm font-bold'>UberGo</div>
                    <img src="/images/lockscreen.png" className='w-3' alt="" />
                    <div className='text-sm font-bold'>4</div>
                  </div>
                  <div className='text-sm font-semibold'>2 mnts away</div>
                  <div className='text-xs text-[#7a6f6fee]'>Affordable, Compact rides</div>
                </div>
                <h3 className='text-lg font-bold'>${Prices.car}</h3>
              </div>

              <div className='flex justify-between gap-4 p-2 items-center border border-[#d2caca] rounded-2xl'
                onClick={() => { setImg("/images/moto.png"); setFinalPrice(Prices.moto); gsap.to(VehicleRef.current, { bottom: "-100%", duration: 0.2, ease: "Power2.inout", onComplete: () => { setActivePanel("ConfirmPanel"); setVehiclePanel(false), setConfirmPanel(true) } }) }}>
                <img src="/images/moto.png" className='w-20 h-auto' alt="" />
                <div className="flex flex-col gap-1">
                  <div className='flex items-center gap-2'>
                    <div className='text-sm font-bold'>Moto</div>
                    <img src="/images/lockscreen.png" className='w-3' alt="" />
                    <div className='text-sm font-bold'>1</div>
                  </div>
                  <div className='text-sm font-semibold'>2 mnts away</div>
                  <div className='text-xs text-[#7a6f6fee]'>Affordable, Compact rides</div>
                </div>
                <h3 className='text-lg font-bold'>${Prices.moto}</h3>
              </div>

              <div className='flex justify-between gap-4 p-2 items-center border border-[#d2caca] rounded-2xl'
                onClick={() => { setImg("/images/auto.png"); setFinalPrice(Prices.auto); gsap.to(VehicleRef.current, { bottom: "-100%", duration: 0.2, ease: "Power2.inout", onComplete: () => { setActivePanel("ConfirmPanel"); setVehiclePanel(false), setConfirmPanel(true) } }) }}>
                <img src="/images/auto.png" className='w-24 h-auto' alt="" />
                <div className="flex flex-col gap-1">
                  <div className='flex items-center gap-2'>
                    <div className='text-sm font-bold'>UberAuto</div>
                    <img src="/images/lockscreen.png" className='w-3' alt="" />
                    <div className='text-sm font-bold'>3</div>
                  </div>
                  <div className='text-sm font-semibold'>2 mnts away</div>
                  <div className='text-xs text-[#7a6f6fee]'>Affordable, Compact rides</div>
                </div>
                <h3 className='text-lg font-bold'>${Prices.auto}</h3>
              </div>
            </div>
            <div className="text-xs text-gray-500 text-center p-2 select-none bg-white">
              Fare calculations use data from <a href="https://nominatim.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="underline">Nominatim</a>, <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a>, and <a href="http://project-osrm.org/" target="_blank" rel="noopener noreferrer" className="underline">OSRM</a>.
            </div>
          </div>

        </div>
      )}


      {/* Fourth Portion */}
      {ActivePanel === "ConfirmPanel" &&
        (<div className='fixed bottom-0 bg-white w-full h-auto ' ref={ConfirmRef}>
          <div className='flex justify-between px-2'>
            <h3 className='font-bold text-2xl p-2 bg-white'>Confirm your ride</h3>
            <img src="/images/down.svg" className='w-5' alt=""
              // onClick={() => { setActivePanel("VehiclePanel"); setConfirmPanel(false); setVehiclePanel(true) }} />
              onClick={() => { gsap.to(ConfirmRef.current, { bottom: "-100%", duration: 0.2, ease: "Power2.inout", onComplete: () => { setActivePanel("VehiclePanel"); setVehiclePanel(true), setConfirmPanel(false) } }) }} />
          </div>

          <div className='flex text-center justify-center'>
            <img src={Img} className='w-48' alt="" />
          </div>

          <div className='flex flex-col mt-3'>
            <div className='flex items-center gap-3 p-3' >
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold capitalize'>{Pickup.split(',')[0].trim()}</div>
                <div className='text-[#9b9393] capitalize'>{Pickup}</div>
                <div className='w-72 bg-gray-300 h-1 mt-2'></div>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3' >
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold capitalize'>{Destination.split(',')[0].trim()}</div>
                <div className='text-[#9b9393] capitalize'>{Destination}</div>
                <div className='w-72 bg-gray-300 h-1 mt-2'></div>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold'>${FinalPrice}</div>
                <div className='text-[#9b9393]'>Cash Cash</div>
              </div>
            </div>

          </div>

          <div className='p-3'>
            <button className='w-full foont-bold text-lg bg-green-400 text-white rounded-md py-1 '
              onClick={async () => {
                const data = { Pickup: Pickup, Destination: Destination, Fare: FinalPrice }
                const response = await axios.post(`http://localhost:3000/rides/register`, data, { headers: { Authorization: `Bearer ${refreshtoken}` } })
                console.log(response.data)
                gsap.to(ConfirmRef.current, { bottom: "-100%", duration: 0.2, ease: "power2.inOut", onComplete: () => { setActivePanel("LookingPanel"); setLookingPanel(true); setConfirmPanel(false) } })
              }}
            >Confirm</button>
          </div>

        </div>)
      }

      {/* Fifth Portion */}
      {ActivePanel === "LookingPanel" &&
        (<div className='fixed bottom-0 bg-white w-full h-auto' ref={LookingRef}>
          <div className='flex justify-between px-2'>
            <h3 className='font-bold text-2xl p-2 bg-white'>Looking for the driver</h3>

          </div>
          <div className='flex text-center justify-center'>
            <img src={Img} className='w-56' alt="" />
          </div>
          <div className='flex flex-col mt-3'>
            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold'>{Pickup.split(',')[0].trim()}</div>
                <div className='text-[#9b9393]'>{Pickup}</div>
                <div className='w-72 bg-gray-300 h-1 mt-2'></div>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold'>{Destination.split(',')[0].trim()}</div>
                <div className='text-[#9b9393]'>{Destination}</div>
                <div className='w-72 bg-gray-300 h-1 mt-2'></div>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold'>{FinalPrice}</div>
                <div className='text-[#9b9393]'>Cash Cash</div>
              </div>
            </div>

          </div>


        </div>)
      }

      {/* Sixth Portion */}
      {
        ActivePanel === "WaitingPanel" &&
        (
          <div className='fixed bottom-0 bg-white w-full h-auto' ref={WaitingRef}>
            <div className='flex justify-between px-2 py-2'>
              <h1 className='font-bold text-2xl'>Waiting For The Driver</h1>
              <div className="relative">
                {Notification !== 0 ?
                  (<div className='rounded-full bg-black text-gray-300 w-6 h-6 flex justify-center items-center text-xs font-bold absolute top-[-5px] left-[-7px]'>{Notification}</div>)
                  :
                  (<div></div>)
                }
                <img src="/images/chat.png" className='w-12 h-auto' alt=""
                  onClick={() => { gsap.to([WaitingRef.current, StartRef.current], { bottom: "-100%", onComplete: () => { setActivePanel("ChattingPanel"); setChattingPanel(true); setWaitingPanel(false) } }) }}
                />
              </div>

            </div>
            <div className='flex justify-between px-1 py-4 items-center'>
              <img src={Img} className='w-28' alt="" />
              <div className='flex flex-col gap-0 leading-smug justify-center items-center'>
                <span className='font-semibold text-sm capitalize'>{Offer.captainInfo.personal_info.fullname.firstname} {Offer.captainInfo.personal_info.fullname.lastname} </span>
                <span className=''>{Offer.captainInfo.vehicle.vehicle_type}</span>
                <span className='font-bold text-md text-base'>{Offer.captainInfo.vehicle.plate}</span>
                <span className='font-bold text-md text-base'>{Offer.rideInfo.OTP}</span>
                <span></span>
              </div>
            </div>

            <div className='flex flex-col mt-3'>

              <div className='flex items-center gap-3 p-3' >
                <img src="/images/location.png" className='w-7 h-7' alt="" />
                <div className='flex flex-col gap-0'>
                  <div className='text-md font-bold capitalize'>{Pickup.split(',')[0].trim()}</div>
                  <div className='text-[#9b9393] capitalize'>{Pickup}</div>
                  <div className='w-72 bg-gray-300 h-1 mt-2'></div>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3' >
                <img src="/images/location.png" className='w-7 h-7' alt="" />
                <div className='flex flex-col gap-0'>
                  <div className='text-md font-bold capitalize'>{Destination.split(',')[0].trim()}</div>
                  <div className='text-[#9b9393] capitalize'>{Destination}</div>
                  <div className='w-72 bg-gray-300 h-1 mt-2'></div>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3'>
                <img src="/images/location.png" className='w-7 h-7' alt="" />
                <div className='flex flex-col gap-0'>
                  <div className='text-md font-bold'>${FinalPrice}</div>
                  <div className='text-[#9b9393]'>Cash Cash</div>
                </div>
              </div>

            </div>

          </div>
        )
      }

      {/* Seventh Portion-Riding Panel */}
      {ActivePanel === "RidingPanel" && (
        <div className='fixed bottom-0 bg-white w-full h-auto' ref={RidingRef}>
          <div className='flex justify-between px-2'>
            <h1 className='font-bold pt-3 pl-3 text-2xl'>Currently Riding...</h1>
          </div>
          <div className='flex justify-between px-1 py-4 items-center'>
            <img src={Img} className='w-28' alt="" />
            <div className='flex flex-col gap-0 leading-smug justify-center items-center'>
              <span className='font-semibold text-sm capitalize'>{Offer.captain.personal_info.fullname.firstname} {Offer.captain.personal_info.fullname.lastname} </span>
              <span className=''>{Offer.captain.vehicle.vehicle_type}</span>
              <span className='font-bold text-md text-base'>{Offer.captain.vehicle.plate}</span>
              <span></span>
            </div>
          </div>

          <div className='flex flex-col mt-3'>

            <div className='flex items-center gap-3 p-3' >
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold capitalize'>{Destination.split(',')[0].trim()}</div>
                <div className='text-[#9b9393] capitalize'>{Destination}</div>
                <div className='w-72 bg-gray-300 h-1 mt-2'></div>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold'>${FinalPrice}</div>
                <div className='text-[#9b9393]'>Cash Cash</div>
              </div>
            </div>

          </div>

          <div className='p-3 flex flex-col gap-2'>
            <button className='w-full foont-bold text-lg bg-green-600 text-white rounded-md py-1 '>Make A Payment</button>
          </div>

        </div>
      )
      }

      {/* 8th Portion-Chatting */}
      {ActivePanel === "ChattingPanel" && (
        <Chat type="user" id={Offer.captainInfo.socketId} socket={socket} setActivePanel={setActivePanel} setChattingPanel={setChattingPanel} setDynamicPanel={setWaitingPanel} setNotification={setNotification} Notification={Notification} ref={ChattingRef} />
      )}

    </div>
  )
}

export default Start

