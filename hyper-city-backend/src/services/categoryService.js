import Category from "../models/Category.js";

const normalizeSlug = (name) =>
    name
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-");

const createCategory = async ({ name, country = "India", description, userRole = "admin", requestedBy }) => {
    if (!name?.trim()) {
        throw new Error("Category name is required");
    }

    const slug = normalizeSlug(name);
    const normalizedCountry = country?.trim() || "India";
    const status = userRole === "admin" ? "approved" : "pending";

    const existing = await Category.findOne({ slug, country: normalizedCountry });
    if (existing) {
        throw new Error("Category already exists for this country");
    }

    return Category.create({
        name: name.trim(),
        slug,
        country: normalizedCountry,
        description: description?.trim(),
        status,
        requestedBy: requestedBy || undefined,
    });
};

const listCategories = async ({ country = "India", includePending = false, status, includeInactive = false, isAdmin = false }) => {
    const normalizedCountry = country?.trim() || "India";
    const query = { country: normalizedCountry };

    if (!includeInactive) {
        query.isActive = true;
    }

    if (status) {
        query.status = status;
    } else if (!includePending) {
        query.status = "approved";
    }

    const queryBuilder = Category.find(query).sort({ status: 1, name: 1 });

    if (isAdmin) {
        queryBuilder.populate("requestedBy", "name email");
    }

    return queryBuilder.lean();
};

const updateCategory = async ({ categoryId, name, description, isActive, status, reviewedBy, reviewMessage }) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new Error("Category not found");
    }

    if (name !== undefined) {
        category.name = name.trim();
        category.slug = normalizeSlug(name);
    }
    if (description !== undefined) {
        category.description = description.trim();
    }
    if (isActive !== undefined) {
        category.isActive = Boolean(isActive);
    }
    if (status !== undefined) {
        const normalizedStatus = status.toString().toLowerCase();
        if (!["pending", "approved", "rejected"].includes(normalizedStatus)) {
            throw new Error("Invalid category status");
        }
        category.status = normalizedStatus;
        if (normalizedStatus !== "pending" && reviewedBy) {
            category.reviewedBy = reviewedBy;
        }
    }
    if (reviewMessage !== undefined) {
        category.reviewMessage = reviewMessage?.trim();
    }

    await category.save();
    return category;
};

const deleteCategory = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new Error("Category not found");
    }
    await category.deleteOne();
};

export { createCategory, listCategories, updateCategory, deleteCategory };
