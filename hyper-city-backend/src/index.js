import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./database/dbconnection.js";
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: [process.env.CLIENT_URL || "http://172.16.26.98:3000"],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
    res.status(200).json({ success: true, message: "Server is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err.message || err);
        process.exit(1);
    }
};

start();