import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CaptainContext } from '../context/CaptainContext'
import { SocketContext } from '../context/SocketContext'
import axios from 'axios'
import { LiveTracking } from '../liveTracking/LiveTracking'
import { Chat } from './Chat'
import { ChatContext } from '../context/ChatContext'

const Captain_UI = () => {
  const navigate = useNavigate()
  const [OTP, setOTP] = useState("")

  async function submitHandler(e) {
    e.preventDefault()
    const stored_user = JSON.parse(localStorage.getItem("captain"))
    const Confirm_By_Captain = { ...Offer, captainInfo: stored_user, OTP }
    const response = await axios.post(`http://localhost:3000/rides/otp`, Confirm_By_Captain)
    if (!response.data.data) {
      setOTP("")
      return
    }
    else {

    }
  }

  const [ActivePanel, setActivePanel] = useState("DetailsPanel")
  const [DetailsPanel, setDetailsPanel] = useState(true)
  const [OfferPanel, setOfferPanel] = useState(false)
  const [FinalConfirmationPanel, setFinalConfirmationPanel] = useState(false)
  const [RidingPanel, setRidingPanel] = useState(false)
  const [FinishingRidePanel, setFinishingRidePanel] = useState(false)
  const [ChattingPanel, setChattingPanel] = useState(false)
  const [Offer, setOffer] = useState({ passengerInfo: { fullname: { firstname: "", lastname: "" } }, rideInfo: { pickup: "", destination: "", fare: 0 } })
  const [Notification, setNotification] = useState(0)

  const DetailsRef = useRef(null)
  const OfferRef = useRef(null)
  const FinalConfirmationRef = useRef(null)
  const RidingRef = useRef(null)
  const FinishingRideRef = useRef(null)
  const ChattingRef = useRef(null)

  const { captain, setCaptain } = useContext(CaptainContext)
  const { socket } = useContext(SocketContext)
  const { setMessages } = useContext(ChatContext)

  const local_captain = JSON.parse(localStorage.getItem("captain"))


  useEffect(() => {
    const stored_user = JSON.parse(localStorage.getItem("user"))
    setCaptain(stored_user)
    socket.emit("join", { clientType: "captain", clientId: stored_user._id })

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit('updated-captain-location', { clientId: stored_user._id, location: { ltd: position.coords.latitude, lng: position.coords.longitude } })
        })
      }
    }

    const locationInterval = setInterval(updateLocation, 10000)
    updateLocation()


    //2nd step:Data main kya ha: ye passenger ye ride
    socket.on("offer-ride", (data) => {
      setOffer(data)
      setDetailsPanel(false)
      setOfferPanel(true)
      setActivePanel("OfferPanel")
      //  console.log(Offer)
    })

    socket.on("start-ride", (data) => {
      // console.log(data.rideInfo,data.passengerInfo)
      gsap.to(FinalConfirmationRef.current, { bottom: "-100%", duration: 0.2, ease: "power2.inOut", onComplete: () => { setActivePanel("RidingPanel"), setFinalConfirmationPanel(false), setRidingPanel(true) } })
    })

    const messageHandler = (obj) => {
      setMessages((prev) => ([...prev, obj]))
      setNotification((prev) => (prev + 1))
    }


    socket.on("rec-msg", messageHandler)
    

    return () => {
      socket.off("rec-msg", messageHandler); clearInterval(locationInterval)
    }

  }, [])

  //third step
  const sendConfirmEvent = async () => {
    // console.log(Offer)
    const stored_user = JSON.parse(localStorage.getItem("captain"))
    const Confirm_By_Captain = { ...Offer, captainInfo: stored_user }
    // console.log("By Captain:", Confirm_By_Captain)
    await axios.post('http://localhost:3000/rides/confirm', Confirm_By_Captain)
  }

  const sendFinishEvent = async () => {
    const stored_user = JSON.parse(localStorage.getItem("captain"))
    const Confirm_By_Captain = { ...Offer, captainInfo: stored_user }
    setOTP("")
    await axios.post('http://localhost:3000/rides/finish', Confirm_By_Captain)
  }




  useGSAP(() => {
    if (OfferPanel) {
      gsap.from(OfferRef.current, { bottom: "-100%" })
      // gsap.to(OfferRef.current, { height: "80vh" })
    }
    else {
      gsap.to(OfferRef.current, { bottom: "-100%" })
    }
  }, [OfferPanel])

  useGSAP(() => {
    if (FinalConfirmationPanel) {
      gsap.from(FinalConfirmationRef.current, { bottom: "-100%" })
    }
    else {
      gsap.to(FinalConfirmationRef.current, { bottom: "-100%" })
    }
  }, [FinalConfirmationPanel])

  useGSAP(() => {
    if (RidingPanel) {
      gsap.from(RidingRef.current, { bottom: "-100%" })
      // gsap.to(RidingRef.current, { height: "20vh" })
    }
  }, [RidingPanel])

  useGSAP(() => {
    if (FinishingRidePanel) {
      gsap.from(FinishingRideRef.current, { bottom: "-100%" })
      // gsap.to(FinishingRideRef.current, { height: "20vh" })
    }
  }, [FinishingRidePanel])

  useGSAP(() => {
    if (DetailsPanel) {
      gsap.from(DetailsRef.current, { bottom: "-100%" })
      // gsap.to(FinishingRideRef.current, { height: "20vh" })
    }
  }, [DetailsPanel])

  useGSAP(() => {
    if (ChattingPanel) {
      gsap.from(ChattingRef.current, { bottom: "-100%" })
      // gsap.to(FinishingRideRef.current, { height: "20vh" })
    }
  }, [ChattingPanel])



  return (
    <div className='relative overflow-hidden'>
      {/* <div className=" bg-[url('/images/map.jpg')] w-full h-screen fixed">
        <img src="/images/logo.png " className="w-19 ml-6" alt="" />
      </div> */}

      <div className='w-full h-screen fixed z-0'>
        <LiveTracking local_captain={local_captain} />
      </div>


      {/* First Portion- Captain Details One */}
      {ActivePanel === "DetailsPanel" &&
        (<div className='h-[40vh] bottom-0 fixed w-full bg-white rounded-2xl z-10' ref={DetailsRef}>
          <div className='flex mt-4 items-center  px-3 justify-between content-center'>
            <div className='flex items-center content-center gap-2'>
              <img src="/images/kurtlis.png" className='w-12 rounded-full object-cover h-auto' alt="" />
              <span className='font-bold text-1xl'>Jeremiah Curtlis</span>
            </div>
            <div className='flex items-center justify-center gap-3'>
              <span className='text-md font-bold'>$193.20</span>
              <img src="/images/callcab.png" className='w-10' alt="" onClick={() => gsap.to(DetailsRef.current, { bottom: "-100%", onComplete: () => { navigate("/start") } })} />
            </div>
          </div>

          <div className='p-5 '>
            <div className='bg-[#f6f4f4ee] w-full rounded-lg'>
              <div className='flex px-6 justify-between '>
                <div className='flex flex-col py-2 gap-1 items-center'>
                  <img src="/images/car.png" className='w-16' alt="" />
                  <span className='font-bold'>10.2</span>
                  <span className='text-[#bcbabaee]'>Great Work</span>
                </div>

                <div className='flex flex-col py-2 gap-1 items-center'>
                  <img src="/images/car.png" className='w-16' alt="" />
                  <span className='font-bold'>10.2</span>
                  <span className='text-[#bcbabaee]'>Great Work</span>
                </div>

                <div className='flex flex-col py-2 gap-1 items-center'>
                  <img src="/images/car.png" className='w-16' alt="" />
                  <span className='font-bold'>10.2</span>
                  <span className='text-[#dbd1d1ee]'>Great Work</span>
                </div>

              </div>
            </div>
          </div>
        </div>)}

      {/* Second Portion -Offer for a ride*/}
      {ActivePanel === "OfferPanel" &&
        (<div className='fixed bottom-0 bg-white w-full h-auto rounded-2xl z-10' ref={OfferRef}>
          <div className='flex justify-between px-4 mt-5'>
            <h3 className='font-bold text-2xl p-2 bg-white'>Hurray!! New Offer</h3>
            <img src="/images/down.svg" className='w-5' alt="" onClick={() => { gsap.to(OfferRef.current, { bottom: "-100%", onComplete: () => { setOfferPanel(false); setActivePanel("DetailsPanel"); setDetailsPanel(true) } }) }} />

          </div>

          <div className='px-5'>
            <div className='flex justify-between items-center rounded-lg content-center p-3 bg-amber-700'>
              <div className='flex items-center content-center gap-2'>
                <img src="/images/harsh.png" className='w-13 h-auto object-cover rounded-full' alt="" />
                <span className='font-bold capitalize'>{Offer.passengerInfo.fullname.firstname} {Offer.passengerInfo.fullname.lastname}</span>
                {/* <span className='font-bold'>Harsh patel</span> */}
              </div>
              <div className='font-bold'>2.2KM</div>
            </div>
          </div>

          <div className='flex flex-col mt-3'>
            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold capitalize'>{Offer.rideInfo.pickup.split(',')[0].trim()}</div>
                <div className='text-[#9b9393] capitalize'>{Offer.rideInfo.pickup}</div>
                <div className='w-72 bg-gray-300 h-1 mt-2'></div>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold capitalize'>{Offer.rideInfo.destination.split(',')[0].trim()}</div>
                <div className='text-[#9b9393] capitalize'>{Offer.rideInfo.destination}</div>
                <div className='w-72 bg-gray-300 h-1 mt-2'></div>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold'>{Offer.rideInfo.fare}</div>
                <div className='text-[#9b9393]'>Cash Cash</div>
              </div>
            </div>

          </div>

          <div className='px-3 pt-6 pb-4 flex gap-2'>
            <button className='w-full foont-bold text-lg bg-gray-300 text-white rounded-md py-1 '
              onClick={() => { gsap.to(OfferRef.current, { bottom: "-100%", onComplete: () => { setOfferPanel(false); setActivePanel("DetailsPanel"); setDetailsPanel(true) } }) }}
            >Ignore</button>
            <button className='w-full foont-bold text-lg bg-green-600 text-white rounded-md py-1 '
              onClick={() => { sendConfirmEvent(); gsap.to(OfferRef.current, { bottom: "-100%", duration: 0.2, ease: "power2.inOut", onComplete: () => { setActivePanel("FinalConfirmationPanel"), setOfferPanel(false), setFinalConfirmationPanel(true) } }) }}
            >Confirm</button>
          </div>
          <div className="text-xs text-gray-500 text-center p-2 select-none bg-white">
            Fare calculations use data from <a href="https://nominatim.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="underline">Nominatim</a>, <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a>, and <a href="http://project-osrm.org/" target="_blank" rel="noopener noreferrer" className="underline">OSRM</a>.
          </div>
        </div>)}

      {/* here */}

      {/* ThirdPortion-FinalConfirmation */}
      {ActivePanel === "FinalConfirmationPanel" &&
        (<div className='fixed bottom-0 bg-white w-full rounded-2xl h-auto z-10' ref={FinalConfirmationRef}>
          <div className='flex justify-between px-4 mt-8'>
            <h3 className='font-bold text-2xl p-2 bg-white'>You Are Just There!!</h3>
            <img src="/images/down.svg" className='w-5' alt="" onClick={() => { gsap.to(FinalConfirmationRef.current, { bottom: "-100%", onComplete: () => { setActivePanel("DetailsPanel"), setFinalConfirmationPanel(false); setDetailsPanel(true) } }) }} />
          </div>

          <div className='py-5 px-3'>
            <div className='flex justify-between items-center rounded-lg content-center px-3 py-4  bg-amber-700'>
              <div className='flex items-center content-center'>
                <img src="/images/harsh.png" className='w-12 h-auto object-cover rounded-full' alt="" />
                <span className='font-bold capitalize'>{Offer.passengerInfo.fullname.firstname} {Offer.passengerInfo.fullname.lastname}</span>
              </div>
              <div className='font-bold'>
                <span>2.2Km</span>
                <div className="relative mt-2">
                  {Notification !== 0 ?
                    (<div className='rounded-full bg-black text-gray-300 w-6 h-6 flex justify-center items-center text-xs font-bold absolute top-[-5px] left-[-7px]'>{Notification}</div>)
                    :
                    (<div></div>)
                  }
                  <img src="/images/chat.png" className='w-10 mt-2' alt=""
                    onClick={() => { gsap.to(FinalConfirmationRef.current, { bottom: "-100%", onComplete: () => { setActivePanel("ChattingPanel"); setChattingPanel(true); setFinalConfirmationPanel(false) } }) }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col mt-3'>
            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold capitalize'>{Offer.rideInfo.pickup.split(',')[0].trim()}</div>
                <div className='text-[#9b9393] capitalize'>{Offer.rideInfo.pickup}</div>
                <div className='w-72 bg-gray-300 h-1 mt-2'></div>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold capitalize'>{Offer.rideInfo.destination.split(',')[0].trim()}</div>
                <div className='text-[#9b9393] capitalize'>{Offer.rideInfo.destination}</div>
                <div className='w-72 bg-gray-300 h-1 mt-2'></div>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold'>{Offer.rideInfo.fare}</div>
                <div className='text-[#9b9393]'>Cash Cash</div>
              </div>
            </div>

          </div>

          <div className='p-3 '>
            <form action="" className='flex flex-col gap-2' onSubmit={(e) => submitHandler(e)}>
              <input type="text" placeholder='Enter OTP' className='w-full font-mono bg-[#eeee] px-2 py-2' value={OTP} onChange={(e) => setOTP(e.target.value)} />

              <button className='w-full foont-bold text-lg bg-green-600 text-white rounded-md py-1 ' type='submit' >Confirm</button>

              <button className='w-full foont-bold text-lg bg-red-700 text-white rounded-md py-1 ' type='button
              ' onClick={() => { gsap.to(FinalConfirmationRef.current, { bottom: "-100%", onComplete: () => { setActivePanel("DetailsPanel"), setFinalConfirmationPanel(false); setDetailsPanel(true) } }) }}>Cancel</button>
            </form>
          </div>
          <div className="text-xs text-gray-500 text-center p-2 select-none bg-white">
            Fare calculations use data from <a href="https://nominatim.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="underline">Nominatim</a>, <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a>, and <a href="http://project-osrm.org/" target="_blank" rel="noopener noreferrer" className="underline">OSRM</a>.
          </div>
        </div>)}

      {/* FourthPortion-Riding */}
      {ActivePanel === "RidingPanel" && (
        <div className='bottom-0 fixed w-full h-auto rounded-lg bg-orange-400 z-10' ref={RidingRef}>
          <div className='flex justify-center'>
          </div>
          <div className='px-3 py-5 flex gap-8 items-center justify-center'>
            <span className='text-2xl font-bold'>2KM Away</span>
            <span className='text-lg font-bold text-white bg-green-500 px-4 py-2 rounded-lg'
              onClick={() => { gsap.to(RidingRef.current, { bottom: "-100%", duration: 0.2, ease: "power2.inOut", onComplete: () => { setActivePanel("FinishingRidePanel"), setRidingPanel(false), setFinishingRidePanel(true) } }) }}
            >Complete Ride</span>
          </div>
        </div>)}

      {/* FifthPortion-Finishing Ride */}
      {ActivePanel === "FinishingRidePanel" &&
        (<div className='fixed bottom-0 bg-white w-full h-auto rounded-2xl z-10' ref={FinishingRideRef}>
          <div className='flex justify-between px-4 mt-5'>
            <h3 className='font-bold text-2xl p-2 bg-white'>Finish This Ride</h3>
            <img src="/images/down.svg" className='w-5' alt=""
              onClick={() => { gsap.to(FinishingRideRef.current, { bottom: "-100%", onComplete: () => { setActivePanel("RidingPanel"); setFinishingRidePanel(false), setRidingPanel(true) } }) }}
            />

          </div>

          <div className='px-5'>
            <div className='flex justify-between items-center rounded-lg content-center p-3 bg-amber-700'>
              <div className='flex items-center content-center'>
                <img src="/images/harsh.png" className='w-13 h-auto object-cover rounded-full' alt="" />
                <span className='font-bold capitalize'>{Offer.passengerInfo.fullname.firstname} {Offer.passengerInfo.fullname.lastname}</span>
              </div>
              <div className='font-bold'>2.2KM</div>
            </div>
          </div>

          <div className='flex flex-col mt-3'>
            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold capitalize'>{Offer.rideInfo.pickup.split(',')[0].trim()}</div>
                <div className='text-[#9b9393] capitalize'>{Offer.rideInfo.pickup}</div>
                <div className='w-72 bg-gray-300 h-1 mt-2'></div>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold capitalize'>{Offer.rideInfo.destination.split(',')[0].trim()}</div>
                <div className='text-[#9b9393] capitalize'>{Offer.rideInfo.destination}</div>
                <div className='w-72 bg-gray-300 h-1 mt-2'></div>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3'>
              <img src="/images/location.png" className='w-7 h-7' alt="" />
              <div className='flex flex-col gap-0'>
                <div className='text-md font-bold'>{Offer.rideInfo.fare}</div>
                <div className='text-[#9b9393]'>Cash Cash</div>
              </div>
            </div>

          </div>

          <div className='p-3 flex flex-col gap-2'>
            <button className='w-full foont-bold text-lg bg-green-600 text-white rounded-md py-1 '
              onClick={() => { sendFinishEvent(); gsap.to(FinishingRideRef.current, { bottom: "-100%", onComplete: () => { setActivePanel("DetailsPanel"); setFinishingRidePanel(false); setDetailsPanel(true) } }) }}
            >Finish Ride</button>
          </div>
        </div>)}

      {/* Sixth Portion */}
      {ActivePanel === "ChattingPanel" && (
        <Chat type="captain" id={Offer.passengerInfo.socketId} socket={socket} setActivePanel={setActivePanel} setChattingPanel={setChattingPanel} setDynamicPanel={setFinalConfirmationPanel} setNotification={setNotification} Notification={Notification} ref={ChattingRef} />
      )}

    </div>
  )
}

export default Captain_UI