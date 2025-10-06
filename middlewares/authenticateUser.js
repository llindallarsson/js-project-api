import { User } from "../models/User.js";

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");

  try {
    const user = await User.findOne({ accessToken });
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "Access token is invalid" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during authentication" });
  }
};

export default authenticateUser;
