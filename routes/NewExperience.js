import express from "express";
import { NewExperience } from "../controller/NewExperienceController.js";

const router = express.Router();
router.route("/experience").post(NewExperience);
export default router;
