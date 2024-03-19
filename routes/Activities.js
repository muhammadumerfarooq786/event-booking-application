import express from "express";
import { GetActivities } from "../controller/FetchActivitiesController.js";

const router = express.Router();
router.route("/activities").get(GetActivities);
export default router;
