import React, { forwardRef, useEffect, useState, useContext } from 'react'
import { useRef } from 'react'
import gsap from 'gsap'
import { ChatContext } from '../context/ChatContext'

const Chat = forwardRef(({ type, id, socket, setActivePanel, setChattingPanel, setDynamicPanel, setNotification, Notification }, ref) => {

    const { obj, Messages, setMessages, newMessage, setnewMessage, DarkMode, setDarkMode, Overall, setOverall, Userli, setUserli, Captainli, setCaptainli, Input, setInput } = useContext(ChatContext)

    // const didrun = useRef(false)

    const bottomRef = useRef(null)//auto scroll to bottom for each new msg

    const submitHandler = async (e) => {
        e.preventDefault()
        const hold = { type, text: newMessage }
        socket.emit("send-msg", { id, new: hold })
        // console.log(`SECOND:`)
        setnewMessage("")
    }

    useEffect(function () {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [Messages])


    useEffect(() => {
        if (!DarkMode) {
            setOverall(obj.white.overall)
            setUserli(obj.white.user)
            setCaptainli(obj.white.captain)
            setInput(obj.white.input)
        }
        else {
            setOverall(obj.black.overall)
            setUserli(obj.black.user)
            setCaptainli(obj.black.captain)
            setInput(obj.black.input)
        }
    }, [DarkMode])



    return (
        <div className={Overall} ref={ref}>
            <div className='h-[95%] overflow-y-auto '>
                <div className='flex justify-between items-center px-2 font-bold mt-4'>
                    <h2 className='mb-3'>Start Of The Chat</h2>
                    <div className='flex gap-3'>
                        <input type="checkbox" checked={DarkMode} onChange={(e) => { setDarkMode((prev) => !prev) }} />
                        <img src="/images/down.svg" className='w-5' alt=""
                            onClick={() => {
                                gsap.to(ref.current, {
                                    bottom: "-100%",
                                    onComplete: () => {
                                        if (type === "user") {
                                            setActivePanel("WaitingPanel");
                                        } else {
                                            setActivePanel("FinalConfirmationPanel");
                                        }
                                        setChattingPanel(false);
                                        setDynamicPanel(true);
                                        setNotification(0);
                                    }
                                });
                            }}
                        />
                    </div>
                </div>
                <ul className='font-bold px-3 flex flex-col gap-3'>
                    {
                        Messages.map((message, index) => {
                            // console.log(Messages.length)
                            if (message.type === "user") {

                                return (
                                    <li className={Userli} key={index}>{message.text}</li>
                                )
                            }
                            else {
                                return (
                                    <li className={Captainli} key={index}>{message.text}</li>
                                )
                            }
                        })
                    }
                    <div ref={bottomRef}></div>
                </ul>
            </div>

            <div className='h-[5%] w-full bottom-0 fixed bg-gray-200'>
                <form action="" className='flex items-center justify-between px-1' onSubmit={(e) => { submitHandler(e) }}>
                    <input type="text" placeholder='Enter Your Message' value={newMessage} className={Input} onChange={(e) => { setnewMessage(e.target.value) }} />
                    <button type='submit'>
                        <img src="/images/send.png" alt="" className='w-10' />
                    </button>
                </form>
            </div>
        </div>
    )
})

export { Chat }