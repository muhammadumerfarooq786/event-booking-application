import express from "express";
import { LoginUser } from "../controller/LoginUserController.js";

const router = express.Router();
router.route("/user").get(LoginUser);
export default router;
