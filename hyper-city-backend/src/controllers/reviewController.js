import asyncHandler from "../utils/asyncHandler.js";
import { addReview, getServiceReviews } from "../services/reviewService.js";
import { uploadManyImages } from "../utils/cloudinary.js";

const createReview = asyncHandler(async (req, res) => {
    const { serviceId, rating, comment } = req.body;

    if (!serviceId || !rating) {
        res.status(400);
        throw new Error("serviceId and rating are required");
    }

    const uploadedImages = await uploadManyImages(req.files || [], "citysaathi/reviews");

    const review = await addReview({
        userId: req.user._id,
        serviceId,
        rating,
        comment,
        images: uploadedImages,
    });

    res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: review,
    });
});

const fetchReviewsByService = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const result = await getServiceReviews(serviceId, req.query);

    res.status(200).json({
        success: true,
        ...result,
    });
});

export { createReview, fetchReviewsByService };
