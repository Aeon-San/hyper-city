import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import { registerUser, loginUser, listUsers, updateUserRole } from "../services/authService.js";

const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body);
    generateToken(res, user._id);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: sanitizeUser(user),
    });
});

const login = asyncHandler(async (req, res) => {
    const user = await loginUser(req.body);
    generateToken(res, user._id);

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: sanitizeUser(user),
    });
});

const logout = asyncHandler(async (_req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});

const getUsers = asyncHandler(async (_req, res) => {
    const users = await listUsers();

    res.status(200).json({
        success: true,
        count: users.length,
        data: users,
    });
});

const changeUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
        res.status(400);
        throw new Error("Role is required");
    }

    const updatedUser = await updateUserRole({
        userId,
        role,
        actorId: req.user._id,
    });

    res.status(200).json({
        success: true,
        message: "User role updated successfully",
        data: sanitizeUser(updatedUser),
    });
});

export { register, login, logout, getUsers, changeUserRole };
