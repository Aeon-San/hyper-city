import jwt from "jsonwebtoken";
import { getAuthCookieOptions } from "./authCookieOptions.js";

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    const cookieOpts = getAuthCookieOptions();
    res.cookie("token", token, {
        httpOnly: true,
        secure: cookieOpts.secure,
        sameSite: cookieOpts.sameSite,
        path: cookieOpts.path,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
};

export default generateToken;
