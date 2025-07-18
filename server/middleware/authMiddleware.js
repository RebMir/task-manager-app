import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt;
    console.log("TOKEN FROM COOKIES:", token);

    if (!token) {
        console.warn("❌ No token found in cookies");
        return res.status(401).json({ status: false, message: "Not authorized. Try login again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded);

        const user = await User.findById(decoded.id).select("email");

        if (!user) {
            console.warn("❌ Token valid but user not found:", decoded.id);
            return res.status(401).json({ status: false, message: "User not found" });
        }

        req.user = {
            userId: user._id,
            email: user.email,
        };

        next();
    } catch (err) {
        console.error("❌ JWT verify failed:", err.message);
        return res.status(401).json({ status: false, message: "Not authorized. Try login again." });
    }
});


export { protectRoute };
