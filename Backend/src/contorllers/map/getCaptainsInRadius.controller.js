import {Captain} from "../../models/captain.model.js"

const getCaptainsInRadius = async(ltd,lng,radius)=>{
    const captains = await Captain.find({
    location:{
        $geoWithin :{
            $centerSphere : [ [lng , ltd], radius/6371 ]
        }
    }
   })
   return captains
}

export {getCaptainsInRadius}