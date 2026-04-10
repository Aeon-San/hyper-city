import express from "express";
import { createReview, fetchReviewsByService } from "../controllers/reviewController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("user"), createReview);
router.get("/:serviceId", fetchReviewsByService);

export default router;
