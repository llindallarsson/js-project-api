import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
});

// Kryptera lösenord innan det sparas
UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

export const User = mongoose.model("User", UserSchema);
