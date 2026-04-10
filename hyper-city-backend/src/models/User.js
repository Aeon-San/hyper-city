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
        businessName: {
            type: String,
            trim: true,
        },
        businessCategory: {
            type: String,
            trim: true,
        },
        businessAddress: {
            type: String,
            trim: true,
        },
        businessCity: {
            type: String,
            trim: true,
        },
        businessArea: {
            type: String,
            trim: true,
        },
        businessDescription: {
            type: String,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
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

userSchema.pre("validate", function () {
    if (!this.email && !this.phone) {
        this.invalidate("email", "Either email or phone is required");
    }
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
