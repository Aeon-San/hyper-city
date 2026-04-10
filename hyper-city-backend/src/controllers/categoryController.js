import asyncHandler from "../utils/asyncHandler.js";
import { createCategory, listCategories, updateCategory, deleteCategory } from "../services/categoryService.js";

const getCategories = asyncHandler(async (req, res) => {
    const { country, includePending, status } = req.query;
    const requestingAdmin = req.user?.role === "admin";
    const wantsPending = includePending === "true";

    if (wantsPending && !requestingAdmin) {
        res.status(403);
        throw new Error("Not authorized to view pending categories");
    }

    const categories = await listCategories({
        country,
        includePending: requestingAdmin && wantsPending,
        status: requestingAdmin && status ? status.toString().toLowerCase() : undefined,
        isAdmin: requestingAdmin,
    });

    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
    });
});

const createCategoryController = asyncHandler(async (req, res) => {
    const category = await createCategory({
        ...req.body,
        userRole: req.user.role,
        requestedBy: req.user.role === "vendor" ? req.user._id : undefined,
    });

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
    });
});

const updateCategoryController = asyncHandler(async (req, res) => {
    const category = await updateCategory({
        categoryId: req.params.categoryId,
        ...req.body,
        reviewedBy: req.user._id,
    });

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
