import bcrypt from "bcrypt";
import crypto from "crypto";
import express from "express";

import { User } from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Incoming body:", req.body);
  const { username, password } = req.body;

  try {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = new User({
      username,
      password: hashedPassword,
      accessToken: crypto.randomBytes(128).toString("hex"),
    });

    await user.save();

    res.status(201).json({
      userId: user._id,
      username: user.username,
      accessToken: user.accessToken,
    });
  } catch (err) {
    console.error("Signup error:", err);
    if (err.code === 11000) {
      res.status(400).json({ message: "Username already exists" });
    } else {
      res.status(400).json({ message: "Invalid request", error: err });
    }
  }
});

router.post("/sessions", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({
        userId: user._id,
        accessToken: user.accessToken,
      });
    } else {
      res.status(401).json({ error: "Username or password is incorrect" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
