import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { getLocation } from "../contorllers/map/getLocation.controller.js";
import { getTravelInfo } from "../contorllers/map/getTravelInfo.controller.js";
import { getSuggestion } from "../contorllers/map/getSuggestion.controller.js";

const mapRouter = Router()

mapRouter.route("/location").get(getLocation)

mapRouter.route("/info").get(getTravelInfo)

mapRouter.route("/suggestion").get(getSuggestion)
export {mapRouter}