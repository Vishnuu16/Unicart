import User from "../model/Usermodel.js"

export const updateCart = async (req, res) => {
    try {
        console.log("cartupdate");
        
        const { userId, cartItem } = req.body
        console.log(userId);
        
        if (!userId || !cartItem) {
            return res.status(400).json({ success: false, message: "Missing userId or cartItem" });
        }
console.log(cartItem);

        await User.findByIdAndUpdate(userId, { cartItem }, { new: true })
        res.json({success:true,message:"Cart Updated"})
    } catch (error) {
        console.log(error.message); 
        return res.status(500).json({ success: false, message: error.message });
    }
}       