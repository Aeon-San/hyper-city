import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
                validate: {
                    validator: (val) => Array.isArray(val) && val.length === 2,
                    message: "Coordinates must be [longitude, latitude]",
                },
            },
        },
        city: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        area: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        country: {
            type: String,
            trim: true,
            default: "India",
            index: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "approved",
            index: true,
        },
        address: {
            type: String,
            trim: true,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

serviceSchema.index({ location: "2dsphere" });

const Service = mongoose.model("Service", serviceSchema);

export default Service;
