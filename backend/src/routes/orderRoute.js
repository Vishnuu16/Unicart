import { Router } from "express"
import authUser from "../middleware/authUser.js"
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderRazorpay, verifyRazorpayPayment } from "../controllers/orderController.js"
import authSeller from "../middleware/authSeller.js"

const router= Router()

router.post('/cod',authUser,placeOrderCOD)
router.post('/razorpay',authUser,placeOrderRazorpay)
router.get('/user',authUser,getUserOrders)
router.get('/seller',authSeller,getAllOrders)
router.post("/verify", verifyRazorpayPayment);

export default router     