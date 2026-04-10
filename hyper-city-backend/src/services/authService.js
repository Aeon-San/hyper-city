import User from "../models/User.js";
import Service from "../models/Service.js";
import AppError from "../utils/appError.js";

const registerUser = async ({ name, email, phone, password, role, adminSecret, businessName, businessCategory, businessAddress, businessCity, businessArea, businessDescription, website }) => {
    if (!name || !password) {
        throw new AppError("Name and password are required", 400);
    }

    if (!email && !phone) {
        throw new AppError("Either email or phone is required", 400);
    }

    if (email) {
        const existingByEmail = await User.findOne({ email });
        if (existingByEmail) {
            throw new AppError("Email already in use", 409);
        }
    }

    if (phone) {
        const existingByPhone = await User.findOne({ phone });
        if (existingByPhone) {
            throw new AppError("Phone already in use", 409);
        }
    }

    const requestedRole = role?.toLowerCase?.();

    if (requestedRole === "admin") {
        const configuredSecret = process.env.ADMIN_SIGNUP_SECRET?.trim() || process.env.ADMIN_SECRET?.trim();

        if (!configuredSecret) {
            throw new AppError("Admin signup is disabled", 403);
        }

        if (!adminSecret || adminSecret !== configuredSecret) {
            throw new AppError("Invalid admin secret", 403);
        }
    }

    const signupRole = ["user", "vendor", "admin"].includes(requestedRole) ? requestedRole : "user";

    const user = await User.create({
        name,
        email,
        phone,
        password,
        role: signupRole,
        businessName,
        businessCategory,
        businessAddress,
        businessCity,
        businessArea,
        businessDescription,
        website,
    });

    return user;
};

const loginUser = async ({ email, phone, password }) => {
    if (!password || (!email && !phone)) {
        throw new AppError("Provide password and either email or phone", 400);
    }

    const query = email ? { email } : { phone };
    const user = await User.findOne(query).select("+password");

    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
        throw new AppError("Invalid credentials", 401);
    }

    return user;
};

const listUsers = async () => {
    return User.find({}).select("name email phone role createdAt updatedAt").sort({ createdAt: -1 });
};

const updateUserRole = async ({ userId, role, actorId }) => {
    const allowedRoles = ["user", "vendor", "admin"];

    if (!allowedRoles.includes(role)) {
        throw new AppError("Invalid role value", 400);
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
        throw new AppError("User not found", 404);
    }

    if (String(targetUser._id) === String(actorId) && role !== "admin") {
        throw new AppError("Admin cannot downgrade own role", 403);
    }

    targetUser.role = role;
    await targetUser.save();

    return targetUser;
};

const updateCurrentUserProfile = async ({ userId, name, email, phone, password, businessName, businessCategory, businessAddress, businessCity, businessArea, businessDescription, website }) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (name !== undefined) {
        if (!name?.trim()) {
            throw new AppError("Name cannot be empty", 400);
        }

        user.name = name.trim();
    }

    if (email !== undefined) {
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail) {
            user.email = undefined;
        } else {
            const existingByEmail = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: userId },
            });

            if (existingByEmail) {
                throw new AppError("Email already in use", 409);
            }

            user.email = normalizedEmail;
        }
    }

    if (phone !== undefined) {
        const normalizedPhone = phone?.trim();

        if (!normalizedPhone) {
            user.phone = undefined;
        } else {
            const existingByPhone = await User.findOne({
                phone: normalizedPhone,
                _id: { $ne: userId },
            });

            if (existingByPhone) {
                throw new AppError("Phone already in use", 409);
            }

            user.phone = normalizedPhone;
        }
    }

    if (password !== undefined && password !== "") {
        if (password.length < 6) {
            throw new AppError("Password must be at least 6 characters", 400);
        }

        user.password = password;
    }

    if (businessName !== undefined) {
        user.businessName = businessName?.trim() || undefined;
    }
    if (businessCategory !== undefined) {
        user.businessCategory = businessCategory?.trim() || undefined;
    }
    if (businessAddress !== undefined) {
        user.businessAddress = businessAddress?.trim() || undefined;
    }
    if (businessCity !== undefined) {
        user.businessCity = businessCity?.trim() || undefined;
    }
    if (businessArea !== undefined) {
        user.businessArea = businessArea?.trim() || undefined;
    }
    if (businessDescription !== undefined) {
        user.businessDescription = businessDescription?.trim() || undefined;
    }
    if (website !== undefined) {
        user.website = website?.trim() || undefined;
    }

    if (!user.email && !user.phone) {
        throw new AppError("Either email or phone is required", 400);
    }

    await user.save();

    return user;
};

const listVendors = async ({ page = 1, limit = 20, search = "" }) => {
    const normalizedPage = Math.max(Number(page) || 1, 1);
    const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (normalizedPage - 1) * normalizedLimit;

    const query = { role: "vendor" };

    if (search?.trim()) {
        const keyword = search.trim();
        query.$or = [
            { name: new RegExp(keyword, "i") },
            { email: new RegExp(keyword, "i") },
            { phone: new RegExp(keyword, "i") },
            { businessName: new RegExp(keyword, "i") },
            { businessCategory: new RegExp(keyword, "i") },
            { businessAddress: new RegExp(keyword, "i") },
        ];
    }

    const [vendors, total] = await Promise.all([
        User.find(query)
            .select("name email phone role createdAt updatedAt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(normalizedLimit)
            .lean(),
        User.countDocuments(query),
    ]);

    return {
        page: normalizedPage,
        limit: normalizedLimit,
        total,
        count: vendors.length,
        data: vendors,
    };
};

const getVendorById = async (vendorId) => {
    const vendor = await User.findOne({ _id: vendorId, role: "vendor" })
        .select(
            "name email phone role businessName businessCategory businessAddress businessCity businessArea businessDescription website createdAt updatedAt"
        )
        .lean();

    if (!vendor) {
        throw new AppError("Vendor not found", 404);
    }

    return vendor;
};

const updateVendorByAdmin = async ({ vendorId, name, email, phone, businessName, businessCategory, businessAddress, businessCity, businessArea, businessDescription, website }) => {
    const vendor = await User.findOne({ _id: vendorId, role: "vendor" });

    if (!vendor) {
        throw new AppError("Vendor not found", 404);
    }

    if (name !== undefined) {
        if (!name?.trim()) {
            throw new AppError("Name cannot be empty", 400);
        }

        vendor.name = name.trim();
    }

    if (email !== undefined) {
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail) {
            vendor.email = undefined;
        } else {
            const existingByEmail = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: vendorId },
            });

            if (existingByEmail) {
                throw new AppError("Email already in use", 409);
            }

            vendor.email = normalizedEmail;
        }
    }

    if (phone !== undefined) {
        const normalizedPhone = phone?.trim();

        if (!normalizedPhone) {
            vendor.phone = undefined;
        } else {
            const existingByPhone = await User.findOne({
                phone: normalizedPhone,
                _id: { $ne: vendorId },
            });

            if (existingByPhone) {
                throw new AppError("Phone already in use", 409);
            }

            vendor.phone = normalizedPhone;
        }
    }

    if (businessName !== undefined) {
        vendor.businessName = businessName?.trim() || undefined;
    }
    if (businessCategory !== undefined) {
        vendor.businessCategory = businessCategory?.trim() || undefined;
    }
    if (businessAddress !== undefined) {
        vendor.businessAddress = businessAddress?.trim() || undefined;
    }
    if (businessCity !== undefined) {
        vendor.businessCity = businessCity?.trim() || undefined;
    }
    if (businessArea !== undefined) {
        vendor.businessArea = businessArea?.trim() || undefined;
    }
    if (businessDescription !== undefined) {
        vendor.businessDescription = businessDescription?.trim() || undefined;
    }
    if (website !== undefined) {
        vendor.website = website?.trim() || undefined;
    }

    if (!vendor.email && !vendor.phone) {
        throw new AppError("Either email or phone is required", 400);
    }

    await vendor.save();

    return vendor;
};

const deleteVendorByAdmin = async (vendorId) => {
    const vendor = await User.findOne({ _id: vendorId, role: "vendor" });

    if (!vendor) {
        throw new AppError("Vendor not found", 404);
    }

    await Promise.all([
        Service.deleteMany({ vendorId: vendor._id }),
        vendor.deleteOne(),
    ]);
};

const createVendorByAdmin = async ({ name, email, phone, password, businessName, businessCategory, businessAddress, businessCity, businessArea, businessDescription, website }) => {
    return registerUser({
        name,
        email,
        phone,
        password,
        role: "vendor",
        businessName,
        businessCategory,
        businessAddress,
        businessCity,
        businessArea,
        businessDescription,
        website,
    });
};

export {
    registerUser,
    loginUser,
    listUsers,
    updateUserRole,
    updateCurrentUserProfile,
    listVendors,
    getVendorById,
    updateVendorByAdmin,
    deleteVendorByAdmin,
    createVendorByAdmin,
};
