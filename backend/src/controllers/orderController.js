import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";

export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" })
        }
        // calculate amount
        let amount = await items.reduce(async (acc, i) => {
            const product = await Product.findById(i.product)
            return (await acc) + product.offerPrice * i.quantity
        }, 0)

        // add tax
        amount += Math.floor(amount * 0.02)
        await Order.create({
            userId,
            items,
            address,
            paymentType: 'COD'
        })
        return res.json({ succes: true, message: "Order Placed" })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find(
            {
                userId, $or: [{ paymentType: "COD" },
                { isPaid: true }]
            })
            .populate('items.product address').sort({
                createdAt: -1
            })
        return res.json({ succes: true, orders })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });

    }
}

export const getAllOrders = async (req, res) => {
    try {
       
        const orders = await Order.find(
            {
               $or: [{ paymentType: "COD" },
                { isPaid: true }]
            })
            .populate('items.product address').sort({
                createdAt: -1
            })
        return res.json({ succes: true, orders })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });

    }
}