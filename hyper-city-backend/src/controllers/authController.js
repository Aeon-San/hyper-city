import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import { getAuthCookieOptions } from "../utils/authCookieOptions.js";
import {
    registerUser,
    loginUser,
    listUsers,
    updateUserRole,
    updateCurrentUserProfile,
    listVendors,
    getVendorById,
    updateVendorByAdmin,
    deleteVendorByAdmin,
    createVendorByAdmin,
} from "../services/authService.js";

const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    businessName: user.businessName,
    businessCategory: user.businessCategory,
    businessAddress: user.businessAddress,
    businessCity: user.businessCity,
    businessArea: user.businessArea,
    businessDescription: user.businessDescription,
    website: user.website,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body);
    const token = generateToken(res, user._id);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        data: sanitizeUser(user),
    });
});

const login = asyncHandler(async (req, res) => {
    const user = await loginUser(req.body);
    const token = generateToken(res, user._id);

    res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        data: sanitizeUser(user),
    });
});

const logout = asyncHandler(async (_req, res) => {
    const cookieOpts = getAuthCookieOptions();
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: cookieOpts.secure,
        sameSite: cookieOpts.sameSite,
        path: cookieOpts.path,
    });

    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: sanitizeUser(req.user),
    });
});

const updateMe = asyncHandler(async (req, res) => {
    const updatedUser = await updateCurrentUserProfile({
        userId: req.user._id,
        ...req.body,
    });

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: sanitizeUser(updatedUser),
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

const getVendors = asyncHandler(async (req, res) => {
    const result = await listVendors(req.query);

    res.status(200).json({
        success: true,
        ...result,
    });
});

const getVendor = asyncHandler(async (req, res) => {
    const vendor = await getVendorById(req.params.vendorId);

    res.status(200).json({
        success: true,
        data: vendor,
    });
});

const updateVendor = asyncHandler(async (req, res) => {
    const updatedVendor = await updateVendorByAdmin({
        vendorId: req.params.vendorId,
        ...req.body,
    });

    res.status(200).json({
        success: true,
        message: "Vendor updated successfully",
        data: sanitizeUser(updatedVendor),
    });
});

const deleteVendor = asyncHandler(async (req, res) => {
    await deleteVendorByAdmin(req.params.vendorId);

    res.status(200).json({
        success: true,
        message: "Vendor deleted successfully",
    });
});

const createVendor = asyncHandler(async (req, res) => {
    const vendor = await createVendorByAdmin(req.body);

    res.status(201).json({
        success: true,
        message: "Vendor created successfully",
        data: sanitizeUser(vendor),
    });
});

export {
    register,
    login,
    logout,
    getMe,
    updateMe,
    getUsers,
    changeUserRole,
    getVendors,
    getVendor,
    updateVendor,
    deleteVendor,
    createVendor,
};
