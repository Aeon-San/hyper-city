import Service from "../models/Service.js";

const createServiceListing = async (payload, vendorId) => {
    const {
        name,
        category,
        phone,
        city,
        area,
        address,
        lat,
        lng,
        coordinates,
    } = payload;

    let locationCoordinates = coordinates;

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

    return Service.create({
        name,
        category,
        phone,
        city,
        area,
        address,
        location: {
            type: "Point",
            coordinates: [longitude, latitude],
        },
        vendorId,
    });
};

const discoverServices = async ({ lat, lng, city, category, radiusKm = 10, page = 1, limit = 20 }) => {
    const normalizedPage = Math.max(Number(page) || 1, 1);
    const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (normalizedPage - 1) * normalizedLimit;

    const categoryFilter = category ? { category: new RegExp(`^${category}$`, "i") } : {};

    if (lat !== undefined && lng !== undefined) {
        const latitude = Number(lat);
        const longitude = Number(lng);

        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
            throw new Error("Invalid lat/lng values");
        }

        const services = await Service.find({
            ...categoryFilter,
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: Number(radiusKm) * 1000,
                },
            },
        })
            .skip(skip)
            .limit(normalizedLimit)
            .lean();

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
        const services = await Service.find({ city: cityRegex, ...categoryFilter })
            .sort({ area: 1, name: 1 })
            .skip(skip)
            .limit(normalizedLimit)
            .lean();

        const groupedByArea = services.reduce((acc, service) => {
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
            count: services.length,
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

export { createServiceListing, discoverServices };
