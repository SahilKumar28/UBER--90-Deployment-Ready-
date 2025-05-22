import React, { useEffect } from 'react'
import { MapContainer, TileLayer } from "react-leaflet"
import { useState } from 'react'
import "leaflet/dist/leaflet.css";
import axios from 'axios';
import L from "leaflet";
import { useMap } from "react-leaflet"

const LiveTracking = ({local_captain}) => {


    const [Cords, setCords] = useState([48.864716, 2.349014])//[ltd,lng]-Paris

    const Recentermap = ({ Cords }) => {
        const map = useMap()
        useEffect(() => {
            map.setView(Cords, map.getZoom())
            document.querySelector(".leaflet-control-attribution")?.remove();
            L.control.attribution({ position: "topright" }).addTo(map);
        }, [Cords])
    }

    useEffect(() => {
        

        const fetchCaptainCords = async () => {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/captainloc`, { id: local_captain._id })
            console.log("here:", response.data.data)
            const ltd = response.data.data[1]
            const lng = response.data.data[0]
            setCords([ltd, lng])//[24.3,55.4]
        }

        fetchCaptainCords()
        const func = setInterval(fetchCaptainCords, 5000)

        return () => { clearInterval(func) }
    }, [])

    return (
        <>
            <MapContainer center={Cords} zoom={11} style={{ height: "100vh", width: "100%", zIndex: "0" }}>

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Recentermap Cords={Cords} />

            </MapContainer>
            <style>
                {`.leaflet-control-attribution {
          font-size: 11px ;
          margin: 8px;
        }`}
            </style>
        </>


    )
}

export { LiveTracking } 