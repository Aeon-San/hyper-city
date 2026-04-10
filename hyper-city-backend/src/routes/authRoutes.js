import express from "express";
import {
	login,
	logout,
	register,
	getMe,
	updateMe,
	getUsers,
	changeUserRole,
	getVendors,
	getVendor,
	updateVendor,
	deleteVendor,
	createVendor,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.get("/users", protect, authorize("admin"), getUsers);
router.patch("/users/:userId/role", protect, authorize("admin"), changeUserRole);
router.get("/vendors", protect, authorize("admin"), getVendors);
router.post("/vendors", protect, authorize("admin"), createVendor);
router.get("/vendors/:vendorId", protect, authorize("admin"), getVendor);
router.patch("/vendors/:vendorId", protect, authorize("admin"), updateVendor);
router.delete("/vendors/:vendorId", protect, authorize("admin"), deleteVendor);

export default router;
