import mongoose from "mongoose";

const thoughtSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Message is required"],
      minlength: [5, "Message must be at least 5 characters"],
      maxlength: [140, "Message cannot exceed 140 characters"],
      trim: true,
    },
    hearts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }
);

const Thought = mongoose.model("Thought", thoughtSchema);

export default Thought;
