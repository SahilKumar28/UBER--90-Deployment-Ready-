import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import axios from "axios"

async function geocoding(address) {

  const response = await axios.get(`http://localhost:3000/maps/location?address=${address}`)
  return response
}

async function getRouteInfo(lon1, lat1, lon2, lat2, mode) {

  const apiURL = `https://router.project-osrm.org/route/v1/${mode}/${lon1},${lat1};${lon2},${lat2}?overview=false&geometries=geojson`
  // console.log(apiURL)
  try {
    const response = await axios.get(apiURL)
    if (response.data.code !== "Ok" || !response.data.routes || response.data.routes.length === 0) throw new ApiError(404, "No response detected")

    const route = response.data.routes[0]

    return { distance: route.distance, duration: route.duration }
  } catch (error) {
    console.log(`error yahan ha:${error}`)
  }
}


const getTravelInfo = asyncHandler(async (req, res) => {

  const { origin, destination, mode } = req.query

  if (!origin || !destination || !mode) {
    throw new ApiError(404, "Origin,mode and destinaion requited");
  }

  try {
    const res1 = await geocoding(origin)
    await new Promise(r => setTimeout(r, 1000))
    const res2 = await geocoding(destination)

    const loc1 = res1.data.data
    const loc2 = res2.data.data


    const routeInfo = await getRouteInfo(loc1.lat, loc1.lon, loc2.lat, loc2.lon, mode)

    // const routeInfo = await getRouteInfo(24.74,68.94,24.69,69.02,mode)

    return res
      .status(200)
      .json(new ApiResponse(200, routeInfo, "TravelInfo Fetched Successfully"))

  } catch (error) {
    throw new ApiError(404, `Error Detected:${error}`)
  }


})

export { getTravelInfo }