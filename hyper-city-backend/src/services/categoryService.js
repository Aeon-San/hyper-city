import Category from "../models/Category.js";

const normalizeSlug = (name) =>
    name
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-");

const createCategory = async ({ name, country = "India", description }) => {
    if (!name?.trim()) {
        throw new Error("Category name is required");
    }

    const slug = normalizeSlug(name);
    const normalizedCountry = country?.trim() || "India";

    const existing = await Category.findOne({ slug, country: normalizedCountry });
    if (existing) {
        throw new Error("Category already exists for this country");
    }

    return Category.create({
        name: name.trim(),
        slug,
        country: normalizedCountry,
        description: description?.trim(),
    });
};

const listCategories = async ({ country = "India" }) => {
    const normalizedCountry = country?.trim() || "India";
    return Category.find({ country: normalizedCountry, isActive: true }).sort({ name: 1 }).lean();
};

const updateCategory = async ({ categoryId, name, description, isActive }) => {
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
