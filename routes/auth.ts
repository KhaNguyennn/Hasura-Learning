import { Router } from "express";
import * as authController from '../controllers/authController'
// const middlewareController = require("../controllers/middlewareControllers");

const router = Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

// router.post("/refresh", authController.requestRefreshToken);

// router.post("/logout", middlewareController.verifyToken, authController.userLogout);

export default router;