import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
    const bearer = req.headers.authorization;
    let token = req.cookies.token;

    if (!token && bearer && bearer.startsWith("Bearer ")) {
        token = bearer.split(" ")[1];
    }

    if (!token) {
        res.status(401);
        throw new Error("Unauthorized: token missing");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
            res.status(401);
            throw new Error("Unauthorized: user not found");
        }

        next();
    } catch (error) {
        res.status(401);
        throw new Error("Unauthorized: invalid token");
    }
});

const optionalProtect = asyncHandler(async (req, res, next) => {
    const bearer = req.headers.authorization;
    let token = req.cookies.token;

    if (!token && bearer && bearer.startsWith("Bearer ")) {
        token = bearer.split(" ")[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password");
        } catch {
            req.user = null;
        }
    }

    next();
});

const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        res.status(403);
        throw new Error("Forbidden: insufficient permissions");
    }

    next();
};

export { protect, optionalProtect, authorize };
