import mongoose from 'mongoose';

const connectDB = async () => {
    if (!process.env.MONGO_URL) {
        console.error("MONGO_URL is not defined in environment variables.");
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Connected: ${conn.connection.host}\n`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

export default connectDB;