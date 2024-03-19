import express from "express";
import { BookExperience } from "../controller/BookExperienceController.js";

const router = express.Router();
router.route("/experience").put(BookExperience);
export default router;
