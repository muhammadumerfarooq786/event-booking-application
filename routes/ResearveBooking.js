import express from "express";
import { NewBooking } from "../controller/NewBookingController.js";

const router = express.Router();
router.route("/experience").post(NewBooking);
export default router;
