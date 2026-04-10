import express from "express";
import { login, logout, register, getUsers, changeUserRole } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/users", protect, authorize("admin"), getUsers);
router.patch("/users/:userId/role", protect, authorize("admin"), changeUserRole);

export default router;
