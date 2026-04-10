import express from "express";
import {
    createCategoryController,
    deleteCategoryController,
    getCategories,
    updateCategoryController,
} from "../controllers/categoryController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, authorize("admin"), createCategoryController);
router.patch("/:categoryId", protect, authorize("admin"), updateCategoryController);
router.delete("/:categoryId", protect, authorize("admin"), deleteCategoryController);

export default router;
