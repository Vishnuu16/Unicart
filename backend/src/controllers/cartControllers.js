import User from "../model/Usermodel.js"

export const updateCart = async (req, res) => {
    try {
        const { userId, cartItem } = req.body

        await User.findbyIdAndUpdate(userId, { cartItem })
        res.json({success:true,message:"Cart Updated"})
    } catch (error) {
        console.log(error.message); 
        return res.status(500).json({ success: false, message: error.message });
    }
}