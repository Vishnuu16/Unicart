import { Router } from "express"
import { upload } from "../config/multer.js"

import authSeller from "../middleware/authSeller.js"
import { addProduct, changeStock, productById, productList } from "../controllers/productController.js"

const router = Router()

router.post('/add', upload.array("images", 5), authSeller, addProduct)

router.get('/list',productList)
router.get('/id',productById)
router.post('/stock',authSeller,changeStock)

export default router