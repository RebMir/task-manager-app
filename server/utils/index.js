import jwt from "jsonwebtoken";

const createJWT = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Use secure cookies in production
        sameSite: "lax", // Prevent CSRF attacks
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
    });
};

export default createJWT;
