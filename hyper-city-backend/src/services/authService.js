import User from "../models/User.js";

const registerUser = async ({ name, email, phone, password }) => {
    if (!name || !password) {
        throw new Error("Name and password are required");
    }

    if (!email && !phone) {
        throw new Error("Either email or phone is required");
    }

    if (email) {
        const existingByEmail = await User.findOne({ email });
        if (existingByEmail) {
            throw new Error("Email already in use");
        }
    }

    if (phone) {
        const existingByPhone = await User.findOne({ phone });
        if (existingByPhone) {
            throw new Error("Phone already in use");
        }
    }

    const user = await User.create({
        name,
        email,
        phone,
        password,
        role: "user",
    });

    return user;
};

const loginUser = async ({ email, phone, password }) => {
    if (!password || (!email && !phone)) {
        throw new Error("Provide password and either email or phone");
    }

    const query = email ? { email } : { phone };
    const user = await User.findOne(query).select("+password");

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
        throw new Error("Invalid credentials");
    }

    return user;
};

const listUsers = async () => {
    return User.find({}).select("name email phone role createdAt updatedAt").sort({ createdAt: -1 });
};

const updateUserRole = async ({ userId, role, actorId }) => {
    const allowedRoles = ["user", "vendor", "admin"];

    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid role value");
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
        throw new Error("User not found");
    }

    if (String(targetUser._id) === String(actorId) && role !== "admin") {
        throw new Error("Admin cannot downgrade own role");
    }

    targetUser.role = role;
    await targetUser.save();

    return targetUser;
};

export { registerUser, loginUser, listUsers, updateUserRole };
