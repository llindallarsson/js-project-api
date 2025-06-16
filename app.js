import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import thoughtRoutes from "./routes/thoughts.js";
import userRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Connect to MongoDB ===
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = Promise;

// === Routes ===
app.get("/", (req, res) => {
  res.send("Welcome to the Happy Thoughts API!");
});

app.use("/thoughts", thoughtRoutes);
app.use("/users", userRoutes);

export default app;
