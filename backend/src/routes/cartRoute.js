import { Router } from "express"
import authUser from "../middleware/authUser.js"
import { updateCart } from "../controllers/cartControllers.js"
const router =Router()

router.post('/update',authUser,updateCart)

export default router;
