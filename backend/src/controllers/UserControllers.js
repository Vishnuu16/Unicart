import User from "../model/Usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//register User


export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hasshedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hasshedPassword });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({ success: true, message: "User created successfully", User: { email: newUser.email, name: newUser.name, } });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}
//login User
export const loginUser = async (req, res) => {
    console.log("login triggered");

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
       
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ success: true, message: "User logged in successfully", User: { email: user.email, name: user.name, } });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}


//chechauth

export const checkAuth = async (req, res) => {
    console.log("checkauth triggered");

    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password")
        console.log(user);
        
        return res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

//get user

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//logout user
export const logoutUser = async (req, res) => {
    try {
        console.log("logout trig");
        
        res.clearCookie("token", {
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

