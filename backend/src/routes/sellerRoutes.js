import {Router} from "express"
import { isSellerAuth, sellerLogin, sellerlogout } from "../controllers/sellerController.js";
import authSeller from "../middleware/authSeller.js";




const router = Router()

// Login User
router.post("/login", sellerLogin);
// Check Auth
router.get("/is-auth",authSeller , isSellerAuth)
//logout user
router.get("/logout", authSeller, sellerlogout)



export default router;