import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import userRoutes from "./routes/auth.js";
import thoughtRoutes from "./routes/thoughts.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://happythoughtproject.netlify.app",
];

// === Middleware ===
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// === Connect to MongoDB ===
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// === Routes ===
app.get("/", (req, res) => {
  res.send("Welcome to the Happy Thoughts API!");
});

app.use("/thoughts", thoughtRoutes);
app.use("/users", userRoutes);

export default app;
