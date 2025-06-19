import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {

    const token = req.cookies.token;
    
    console.log("Token received :", token);

    if (!token) {
        return res.status(401).json({ success: false, message: "Token not found. Unauthorized." });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT_SECRET not defined.");
        return res.status(500).json({ success: false, message: "Server error." });
    }

    try {
        const decoded = jwt.verify(token, secret);
        console.log("Decoded JWT:", decoded);

        if (decoded?.id) {
            req.userId = decoded.id; // ✅ Use this
            next();
        } else {
            return res.status(401).json({ success: false, message: "Invalid token payload." });
        }
    } catch (error) {
        console.error("JWT verification error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

export default authUser;
