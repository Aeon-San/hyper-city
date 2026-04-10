import mongoose from "mongoose";
import Review from "../models/Review.js";
import Service from "../models/Service.js";

const updateServiceRatings = async (serviceId) => {
    const stats = await Review.aggregate([
        { $match: { serviceId: new mongoose.Types.ObjectId(serviceId) } },
        {
            $group: {
                _id: "$serviceId",
                avgRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Service.findByIdAndUpdate(serviceId, {
            rating: Number(stats[0].avgRating.toFixed(2)),
            numReviews: stats[0].totalReviews,
        });
    } else {
        await Service.findByIdAndUpdate(serviceId, { rating: 0, numReviews: 0 });
    }
};

const addReview = async ({ userId, serviceId, rating, comment }) => {
    const service = await Service.findById(serviceId);

    if (!service) {
        throw new Error("Service not found");
    }

    const review = await Review.create({
        userId,
        serviceId,
        rating,
        comment,
    });

    await updateServiceRatings(serviceId);

    return review;
};

const getServiceReviews = async (serviceId, { page = 1, limit = 20 }) => {
    const normalizedPage = Math.max(Number(page) || 1, 1);
    const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (normalizedPage - 1) * normalizedLimit;

    const reviews = await Review.find({ serviceId })
        .populate("userId", "name role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(normalizedLimit)
        .lean();

    return {
        page: normalizedPage,
        limit: normalizedLimit,
        count: reviews.length,
        data: reviews,
    };
};

export { addReview, getServiceReviews };
