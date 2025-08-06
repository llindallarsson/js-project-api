import express from "express";

import authenticateUser from "../middlewares/authenticateUser.js";
import HappyThought from "../models/Thought.js";

const router = express.Router();

// get last 20 posts
router.get("/", async (req, res) => {
  try {
    const thoughts = await HappyThought.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch thoughts" });
  }
});

// get single post
router.get("/:id", async (req, res) => {
  try {
    const thought = await HappyThought.findById(req.params.id);
    if (thought) {
      res.json(thought);
    } else {
      res.status(404).json({ error: "Thought not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// add new post
router.post("/", authenticateUser, async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = new HappyThought({
      message,
      createdBy: req.user._id, // lägg till användaren som skapar
    });

    const savedThought = await newThought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    res.status(400).json({ error: "Invalid input", details: error.errors });
  }
});

// update existing post
router.put("/:id", async (req, res) => {
  try {
    const updatedThought = await HappyThought.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedThought) {
      res.status(200).json(updatedThought);
    } else {
      res.status(404).json({ error: "Thought not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid update", details: error.errors });
  }
});

// delete post
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await HappyThought.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: "Thought not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// like post
router.post("/:id/like", async (req, res) => {
  try {
    const thought = await HappyThought.findByIdAndUpdate(
      req.params.id,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (thought) {
      res.status(200).json(thought);
    } else {
      res.status(404).json({ error: "Thought not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

export default router;
