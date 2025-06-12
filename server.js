import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

const mongoURL = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const HappyThought = mongoose.model(
  "HappyThought",
  new mongoose.Schema(
    {
      message: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 140,
      },
      hearts: {
        type: Number,
        default: 0,
      },
      likedBy: {
        type: [String],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  )
);

// ⚠️ Kommentera bort om du inte vill rensa databasen varje gång
/*
HappyThought.deleteMany().then(() => {
  new HappyThought({ message: "Hejsan", hearts: 2 }).save();
  new HappyThought({ message: "Tjaba tjena", hearts: 6 }).save();
  new HappyThought({ message: "Jag älskar smör", hearts: 0 }).save();
});
*/

app.get("/", async (req, res) => {
  const thoughts = await HappyThought.find();
  res.json(thoughts);
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await HappyThought.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch thoughts" });
  }
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = new HappyThought({ message });
    const savedThought = await newThought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    res.status(400).json({ error: "Invalid input", details: error.errors });
  }
});

app.get("/thoughts/:id", async (req, res) => {
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

app.put("/thoughts/:id", async (req, res) => {
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

app.delete("/thoughts/:id", async (req, res) => {
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

app.post("/thoughts/:id/like", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
