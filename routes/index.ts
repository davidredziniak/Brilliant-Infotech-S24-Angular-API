import express, { Request, Response } from "express";
import { register, login } from "../controllers/authController";
const router = express.Router();

//Auth Routes
router.post("/register", register);
router.post("/login", login);

module.exports = router;