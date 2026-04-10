import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
            default: "India",
            index: true,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "approved",
            index: true,
        },
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        reviewMessage: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
