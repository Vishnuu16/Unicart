import { v2 as cloudinary } from "cloudinary";
import Product from "../model/productModel.js";

export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files;
        let imagesUrl = await Promise.all(
            images.map(async (img) => {
                let result = await cloudinary.uploader.upload(img.path, { resource_type: 'image' })
                return result.secure_url
            })
        )
        await Product.create({ ...productData, image: imagesUrl })
        res.json({ success: true, message: "product added" })
    } catch (error) {
        console.log(error.message); 
        return res.status(500).json({ success: false, message: error.message });
    }

}
export const productList = async (req, res) => {
    try {
        const products = await Product.find()
        res.json({ success: true, products })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const productById = async (req, res) => {
    try {
        const { id } = req.body
        const products = await Product.findById(id)
        res.json({ success: true, products })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        await Product.findByIdAndUpdate(id, { inStock })
        res.json({ success: true, message:"Stock Updated"})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}