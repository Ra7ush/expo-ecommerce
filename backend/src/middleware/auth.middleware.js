import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkUserId = req.auth().userId;
      if (!clerkUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await User.findOne({ clerkUserId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
      console.error("Error in protectRoute middleware:", error);
    }
  },
];

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!ENV.ADMIN_EMAILS.includes(req.user.email)) {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};
