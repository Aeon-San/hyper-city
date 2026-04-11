import express from "express";
import { createReview, fetchReviewsByService } from "../controllers/reviewController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { uploadReviewImages } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("user"), uploadReviewImages, createReview);
router.get("/:serviceId", fetchReviewsByService);

export default router;
