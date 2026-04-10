import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            unique: true,
            sparse: true,
        },
        phone: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "vendor", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

userSchema.pre("validate", function (next) {
    if (!this.email && !this.phone) {
        this.invalidate("email", "Either email or phone is required");
    }

    next();
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
