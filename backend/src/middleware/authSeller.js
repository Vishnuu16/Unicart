import jwt from 'jsonwebtoken';


const authSeller = async (req, res, next) => {
    const{sellerToken} = req.cookies;

    if(!sellerToken){
     return res.json({success:true,message:"Not Authorized"})
    }

    try {
        const decoded = jwt.verify(sellerToken, secret);
        console.log("Decoded JWT:", decoded);

        if (decoded?.email === process.env.SELLER_EMAIL) {
           
            next();
        } else {
            return res.status(401).json({ success: false, message: "Invalid token payload." });
        }
    } catch (error) {
        console.error("JWT verification error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
}

export default authSeller;