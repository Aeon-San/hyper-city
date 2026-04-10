import express from "express";
import {
    createCategoryController,
    deleteCategoryController,
    getCategories,
    updateCategoryController,
} from "../controllers/categoryController.js";
import { protect, optionalProtect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalProtect, getCategories);
router.post("/", protect, authorize("vendor", "admin"), createCategoryController);
router.patch("/:categoryId", protect, authorize("admin"), updateCategoryController);
router.delete("/:categoryId", protect, authorize("admin"), deleteCategoryController);

export default router;
