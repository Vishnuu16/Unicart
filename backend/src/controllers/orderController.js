import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";
import stripe from "stripe"
import Razorpay from "razorpay";
import crypto from 'crypto'
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        console.log(userId, items, address);

        if (!address) {
            return res.json({ success: false, message: "Invalid Data" })
        }
        if (items.length === 0) {
            return res.json({ success: false, message: "Add items" })
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
            amount,
            paymentType: 'COD'
        })

        return res.json({ success: true, message: "Order Placed" })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// online payment



const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        console.log("razorpay trigger");
        console.log('jhyy', userId, items, address);


        if (!address) {
            return res.json({ success: false, message: "Invalid Data" });
        }
        if (items.length === 0) {
            return res.json({ success: false, message: "Add items" });
        }

        let amount = await items.reduce(async (acc, i) => {
            const product = await Product.findById(i.product);
            return (await acc) + product.offerPrice * i.quantity;
        }, 0);

        amount += Math.floor(amount * 0.02); // tax


        const order = await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "Online",
            isPaid: false,
        });


        const razorpayOrder = await razorpayInstance.orders.create({
            amount: amount * 100, // Razorpay uses paise
            currency: "INR",
            receipt: order._id.toString(),
            notes: {
                userId: userId.toString(),
                orderId: order._id.toString(),
            },
        });
        console.log(razorpayOrder);

        return res.json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,   
            razorpayKey: process.env.RAZORPAY_KEY_ID,
            orderDbId: order._id,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Razorpay Payment Verification
export const verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderDbId, 
        } = req.body;
        console.log("oreder iddd   ", orderDbId);
        console.log("razorpay_signature  ", razorpay_signature);

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        if (!orderDbId) {
            return res.status(400).json({ success: false, message: "Missing orderDbId" });
          }
          
          const neworder = await Order.findByIdAndUpdate(
            orderDbId,
            {
              isPaid: true,
              razorpay_order_id,
              razorpay_payment_id,
            },
            { new: true }
          );

       

        console.log("Order updated:", neworder);

        return res.json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        console.error("Payment verification failed:", error.message);
        return res.status(500).json({ success: false, message: "Verification failed" });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.query.id;
        console.log("getuserorder", userId);

        const orders = await Order.find({
            userId,
            $or: [
                { paymentType: "COD" },
                { isPaid: true }
            ]
        })
            .populate('items.product')
            .populate('address')
            .sort({ createdAt: -1 });


        return res.json({ success: true, orders });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const getAllOrders = async (req, res) => {
    try {
        console.log("getall orfer tigg");

        const orders = await Order.find(
            {
                $or: [{ paymentType: "COD" },
                { isPaid: true }]
            })
            .populate('items.product')
            .populate('address')
            .sort({ createdAt: -1 });
        return res.json({ success: true, orders })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });

    }
} 