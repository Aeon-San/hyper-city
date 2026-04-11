import asyncHandler from "../utils/asyncHandler.js";
import {
    createServiceListing,
    discoverServices,
    discoverNearbyServices,
    discoverLocalListings,
    getVendorServices,
    getAllServices,
    getPendingServices,
    updateServiceListing,
} from "../services/serviceService.js";
import { uploadManyImages } from "../utils/cloudinary.js";

const getServices = asyncHandler(async (req, res) => {
    const result = await discoverServices(req.query);

    res.status(200).json({
        success: true,
        ...result,
    });
});

const getNearbyServices = asyncHandler(async (req, res) => {
    const { lat, lng, category, radiusKm, page, limit } = req.query;
    const result = await discoverNearbyServices({ lat, lng, category, radiusKm, page, limit });

    res.status(200).json({
        success: true,
        ...result,
    });
});

const getLocalListings = asyncHandler(async (req, res) => {
    const { city, category, search, page, limit } = req.query;
    const result = await discoverLocalListings({ city, category, search, page, limit });

    res.status(200).json({
        success: true,
        ...result,
    });
});

const getVendorServicesController = asyncHandler(async (req, res) => {
    const vendorId = req.user._id;
    const { search, page, limit } = req.query;
    const result = await getVendorServices({ vendorId, search, page, limit });

    res.status(200).json({
        success: true,
        ...result,
    });
});

const getAdminServicesController = asyncHandler(async (req, res) => {
    const { search, page, limit } = req.query;
    const result = await getAllServices({ search, page, limit });

    res.status(200).json({
        success: true,
        ...result,
    });
});

const updateService = asyncHandler(async (req, res) => {
    const serviceId = req.params.id;
    const uploadedImages = await uploadManyImages(req.files || [], "citysaathi/services");
    const service = await updateServiceListing(
        serviceId,
        {
            ...req.body,
            ...(uploadedImages.length ? { images: uploadedImages } : {}),
        },
        req.user._id,
        req.user.role
    );

    res.status(200).json({
        success: true,
        message: "Service updated successfully",
        data: service,
    });
});

const getPendingServiceRequests = asyncHandler(async (req, res) => {
    const { search, city, category, country, page, limit } = req.query;
    const result = await getPendingServices({ search, city, category, country, page, limit });

    res.status(200).json({
        success: true,
        ...result,
    });
});

const createService = asyncHandler(async (req, res) => {
    const uploadedImages = await uploadManyImages(req.files || [], "citysaathi/services");
    const service = await createServiceListing(
        {
            ...req.body,
            images: uploadedImages,
        },
        req.user._id,
        req.user.role
    );

    res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: service,
    });
});

export {
    getServices,
    getNearbyServices,
    getLocalListings,
    getVendorServicesController,
    getAdminServicesController,
    getPendingServiceRequests,
    updateService,
    createService,
};
