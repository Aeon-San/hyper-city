import asyncHandler from "../utils/asyncHandler.js";
import { createCategory, listCategories, updateCategory, deleteCategory } from "../services/categoryService.js";

const getCategories = asyncHandler(async (req, res) => {
    const { country } = req.query;
    const categories = await listCategories({ country });

    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
    });
});

const createCategoryController = asyncHandler(async (req, res) => {
    const category = await createCategory(req.body);

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
    });
});

const updateCategoryController = asyncHandler(async (req, res) => {
    const category = await updateCategory({ categoryId: req.params.categoryId, ...req.body });

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
    });
});

const deleteCategoryController = asyncHandler(async (req, res) => {
    await deleteCategory(req.params.categoryId);

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
    });
});

export { getCategories, createCategoryController, updateCategoryController, deleteCategoryController };
