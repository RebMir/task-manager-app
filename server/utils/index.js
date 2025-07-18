import jwt from "jsonwebtoken";

const createJWT = (res, userId, user) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax", 
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
    });

    return token;
};

export default createJWT;
