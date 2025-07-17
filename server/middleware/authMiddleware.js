import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ status: false, message: "Not authorized. Try login again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("email");

    if (!user) {
      return res.status(401).json({ status: false, message: "User not found" });
    }

    req.user = {
      userId: user._id,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.status(401).json({ status: false, message: "Not authorized. Try login again." });
  }
});

export { protectRoute };
