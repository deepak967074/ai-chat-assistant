import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import chatRoute from "./routes/chat.js";

const app = express();

const PORT = process.env.PORT || 8080;

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "DELETE"],
        credentials: true,
    })
);

app.use(express.json({ limit: "1mb" }));

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: {
        error: "Bahut zyada requests aa rahi hain. 1 minute baad try karo.",
    },
});

app.use("/api", apiLimiter, chatRoute);

app.get("/", (req, res) => {
    res.send("Backend is running");
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected with Database");
    } catch (err) {
        console.log("Failed to connect with Database", err.message);
    }
};

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});