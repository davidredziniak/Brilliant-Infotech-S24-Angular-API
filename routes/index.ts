import express, { Request, Response } from "express";
import { register, login } from "../controllers/authController";
import { user } from "../controllers/userController";
import { personal } from "../controllers/personalController";
const { authorizeJwt } = require("../middleware");

const router = express.Router();

// Auth Routes
router.post("/register", register);
router.post("/login", login);

// Authorized user routes
router.post("/user", [authorizeJwt.verifyToken], user);
router.post("/personal", [authorizeJwt.verifyToken], personal);

module.exports = router;