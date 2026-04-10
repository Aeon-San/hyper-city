import express from "express";
import { createService, getServices } from "../controllers/serviceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getServices);
router.post("/", protect, authorize("vendor", "admin"), createService);

export default router;
