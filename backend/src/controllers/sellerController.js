import jwt from 'jsonwebtoken';


//sellerlogin
export const sellerLogin = (req, res) => {
    try {
        const { email, password } = req.body;
        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' })
            res.cookie("sellerToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.json({ success: true, message: "Logged In" })
        }
        else {
            return res.json({ success: false, message: "Invalid Credentials" })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

//chechauth

export const isSellerAuth = async (req, res) => {
    console.log("checkauth triggered");
    try {
        return res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

//logout user
export const sellerlogout = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
        });
        return res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}