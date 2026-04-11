import mongoose from "mongoose";

const connectDB = async () => {
    const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI;
    if (!mongoUrl) {
        throw new Error("MONGO_URL (or MONGO_URI) is not defined in environment variables.");
    }

    try {
        const conn = await mongoose.connect(mongoUrl);
        console.log(`MongoDB Connected: ${conn.connection.host}\n`);
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export default connectDB;