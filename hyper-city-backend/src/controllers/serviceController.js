import asyncHandler from "../utils/asyncHandler.js";
import { createServiceListing, discoverServices } from "../services/serviceService.js";

const getServices = asyncHandler(async (req, res) => {
    const result = await discoverServices(req.query);

    res.status(200).json({
        success: true,
        ...result,
    });
});

const createService = asyncHandler(async (req, res) => {
    const service = await createServiceListing(req.body, req.user._id);

    res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: service,
    });
});

export { getServices, createService };
