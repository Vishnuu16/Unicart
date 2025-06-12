import { Router } from "express";

import { registerUser, loginUser, checkAuth, logoutUser } from "../controllers/UserControllers.js";
import authUser from "../middleware/authUser.js";



const router = Router();
// '/api/user' is the base route for this router

// Register User
router.post("/register", registerUser);
// Login User
router.post("/login", loginUser);
// Check Auth
router.get("/is-auth", authUser, checkAuth)
//logout user
router.get("/logout", authUser, logoutUser)





export default router;