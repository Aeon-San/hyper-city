import Service from "../models/Service.js";

const parseCoordinatesInput = (coordinates) => {
    if (!coordinates) {
        return null;
    }

    if (Array.isArray(coordinates)) {
        return coordinates;
    }

    if (typeof coordinates === "string") {
        try {
            const parsed = JSON.parse(coordinates);
            return Array.isArray(parsed) ? parsed : null;
        } catch {
            return null;
        }
    }

    return null;
};

const createServiceListing = async (payload, vendorId, userRole = "vendor") => {
    const {
        name,
        category,
        phone,
        images = [],
        city,
        area,
        address,
        country = "India",
        lat,
        lng,
        coordinates,
    } = payload;

    let locationCoordinates = parseCoordinatesInput(coordinates);

    if (!locationCoordinates && lat !== undefined && lng !== undefined) {
        locationCoordinates = [Number(lng), Number(lat)];
    }

    if (!name || !category || !city || !area || !locationCoordinates) {
        throw new Error("Missing required service fields");
    }

    const [longitude, latitude] = locationCoordinates.map(Number);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        throw new Error("Invalid coordinates");
    }

    const status = ["admin", "vendor"].includes(userRole) ? "approved" : "pending";

    return Service.create({
        name,
        category,
        phone,
        images,
        city,
        area,
        country: country.trim() || "India",
        address,
        status,
        location: {
            type: "Point",
            coordinates: [longitude, latitude],
        },
        vendorId,
    });
};

const discoverServices = async ({ lat, lng, city, category, country = "India", radiusKm = 10, page = 1, limit = 20 }) => {
    const normalizedPage = Math.max(Number(page) || 1, 1);
    const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (normalizedPage - 1) * normalizedLimit;

    const categoryFilter = category ? { category: new RegExp(`^${category}$`, "i") } : {};
    const countryFilter = country ? { country: new RegExp(`^${country}$`, "i") } : { country: new RegExp("^India$", "i") };

    if (lat !== undefined && lng !== undefined) {
        const latitude = Number(lat);
        const longitude = Number(lng);

        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
            throw new Error("Invalid lat/lng values");
        }

        const services = await Service.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    distanceField: "distanceMeters",
                    maxDistance: Number(radiusKm) * 1000,
                    spherical: true,
                    query: {
                        ...categoryFilter,
                        ...countryFilter,
                        status: "approved",
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "vendorId",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    distanceKm: {
                        $round: [{ $divide: ["$distanceMeters", 1000] }, 2],
                    },
                    vendorName: "$vendor.name",
                },
            },
            { $skip: skip },
            { $limit: normalizedLimit },
        ]);

        return {
            mode: "geo",
            page: normalizedPage,
            limit: normalizedLimit,
            count: services.length,
            data: services,
        };
    }

    if (city) {
        const cityRegex = new RegExp(`^${city}$`, "i");
        const services = await Service.find({ city: cityRegex, status: "approved", ...categoryFilter, ...countryFilter })
            .populate("vendorId", "name")
            .sort({ area: 1, name: 1 })
            .skip(skip)
            .limit(normalizedLimit)
            .lean();

        const servicesWithVendor = services.map((service) => ({
            ...service,
            vendorName: service.vendorId?.name || null,
        }));

        const groupedByArea = servicesWithVendor.reduce((acc, service) => {
            const key = service.area || "Unknown";
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(service);
            return acc;
        }, {});

        return {
            mode: "city",
            page: normalizedPage,
            limit: normalizedLimit,
            count: servicesWithVendor.length,
            data: groupedByArea,
        };
    }

    return {
        mode: "none",
        page: normalizedPage,
        limit: normalizedLimit,
        count: 0,
        data: [],
    };
};

const discoverNearbyServices = async ({ lat, lng, category, radiusKm = 10, page = 1, limit = 20 }) => {
    return discoverServices({ lat, lng, category, radiusKm, page, limit });
};

const getVendorServices = async ({ vendorId, search = "", page = 1, limit = 20 }) => {
    const normalizedPage = Math.max(Number(page) || 1, 1);
    const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (normalizedPage - 1) * normalizedLimit;

    const query = { vendorId };
    if (search?.trim()) {
        const keyword = search.trim();
        query.$or = [
            { name: new RegExp(keyword, "i") },
            { category: new RegExp(keyword, "i") },
            { area: new RegExp(keyword, "i") },
            { city: new RegExp(keyword, "i") },
        ];
    }

    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
        .populate("vendorId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(normalizedLimit)
        .lean();

    const servicesWithVendor = services.map((service) => ({
        ...service,
        vendorName: service.vendorId?.name || null,
    }));

    return {
        page: normalizedPage,
        limit: normalizedLimit,
        total,
        count: servicesWithVendor.length,
        data: servicesWithVendor,
    };
};

const getAllServices = async ({ search = "", page = 1, limit = 20 }) => {
    const normalizedPage = Math.max(Number(page) || 1, 1);
    const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (normalizedPage - 1) * normalizedLimit;

    const query = {};
    if (search?.trim()) {
        const keyword = search.trim();
        query.$or = [
            { name: new RegExp(keyword, "i") },
            { category: new RegExp(keyword, "i") },
            { area: new RegExp(keyword, "i") },
            { city: new RegExp(keyword, "i") },
            { vendorName: new RegExp(keyword, "i") },
        ];
    }

    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
        .populate("vendorId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(normalizedLimit)
        .lean();

    const servicesWithVendor = services.map((service) => ({
        ...service,
        vendorName: service.vendorId?.name || null,
    }));

    return {
        page: normalizedPage,
        limit: normalizedLimit,
        total,
        count: servicesWithVendor.length,
        data: servicesWithVendor,
    };
};

const updateServiceListing = async (serviceId, payload, userId, userRole) => {
    const service = await Service.findById(serviceId);
    if (!service) {
        throw new Error("Service not found");
    }

    if (userRole !== "admin" && String(service.vendorId) !== String(userId)) {
        throw new Error("Not authorized to update this service");
    }

    const {
        name,
        category,
        phone,
        images,
        city,
        area,
        address,
        country,
        status,
        lat,
        lng,
        coordinates,
    } = payload;

    if (name) service.name = name;
    if (category) service.category = category;
    if (phone) service.phone = phone;
    if (city) service.city = city;
    if (area) service.area = area;
    if (address) service.address = address;
    if (country) service.country = country.trim() || service.country;
    if (Array.isArray(images) && images.length > 0) {
        service.images = [...(service.images || []), ...images];
    }

    if (status !== undefined && userRole === "admin") {
        const normalizedStatus = status.toString().toLowerCase();
        if (!["pending", "approved", "rejected"].includes(normalizedStatus)) {
            throw new Error("Invalid service status");
        }
        service.status = normalizedStatus;
    }

    let locationCoordinates = parseCoordinatesInput(coordinates);
    if (!locationCoordinates && lat !== undefined && lng !== undefined) {
        locationCoordinates = [Number(lng), Number(lat)];
    }

    if (locationCoordinates) {
        const [longitude, latitude] = locationCoordinates.map(Number);

        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
            throw new Error("Invalid coordinates");
        }

        service.location = {
            type: "Point",
            coordinates: [longitude, latitude],
        };
    }

    if (userRole !== "admin" && service.status === "approved") {
        service.status = "pending";
    }

    await service.save();
    return service;
};

const getPendingServices = async ({ search = "", city, category, country = "India", page = 1, limit = 20 }) => {
    const normalizedPage = Math.max(Number(page) || 1, 1);
    const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (normalizedPage - 1) * normalizedLimit;

    const query = { status: "pending", country: new RegExp(`^${country}$`, "i") };
    if (search?.trim()) {
        const keyword = search.trim();
        query.$or = [
            { name: new RegExp(keyword, "i") },
            { category: new RegExp(keyword, "i") },
            { area: new RegExp(keyword, "i") },
            { city: new RegExp(keyword, "i") },
        ];
    }
    if (city) {
        query.city = new RegExp(`^${city}$`, "i");
    }
    if (category) {
        query.category = new RegExp(`^${category}$`, "i");
    }

    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
        .populate("vendorId", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(normalizedLimit)
        .lean();

    const servicesWithVendor = services.map((service) => ({
        ...service,
        vendorName: service.vendorId?.name || null,
    }));

    return {
        page: normalizedPage,
        limit: normalizedLimit,
        total,
        count: servicesWithVendor.length,
        data: servicesWithVendor,
    };
};

const discoverLocalListings = async ({ city, category, search = "", country = "India", page = 1, limit = 20 }) => {
    const normalizedPage = Math.max(Number(page) || 1, 1);
    const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (normalizedPage - 1) * normalizedLimit;

    const query = { status: "approved", country: new RegExp(`^${country}$`, "i") };
    if (city) {
        query.city = new RegExp(`^${city}$`, "i");
    }
    if (category) {
        query.category = new RegExp(`^${category}$`, "i");
    }
    if (search?.trim()) {
        const keyword = search.trim();
        query.$or = [
            { name: new RegExp(keyword, "i") },
            { category: new RegExp(keyword, "i") },
            { area: new RegExp(keyword, "i") },
            { city: new RegExp(keyword, "i") },
        ];
    }

    const services = await Service.find(query)
        .populate("vendorId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(normalizedLimit)
        .lean();

    const servicesWithVendor = services.map((service) => ({
        ...service,
        vendorName: service.vendorId?.name || null,
    }));

    return {
        mode: "local",
        page: normalizedPage,
        limit: normalizedLimit,
        count: servicesWithVendor.length,
        data: servicesWithVendor,
    };
};

export {
    createServiceListing,
    discoverServices,
    discoverNearbyServices,
    discoverLocalListings,
    getVendorServices,
    getAllServices,
    getPendingServices,
    updateServiceListing,
};
