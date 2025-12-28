import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

// Custom protect route that returns 401 JSON for API routes instead of redirecting
export const protectRoute = async (req, res, next) => {
  try {
    // Get auth from Clerk's middleware (automatically attached by clerkMiddleware)
    const auth = req.auth();

    if (!auth || !auth.userId) {
      return res.status(401).json({ message: "Unauthorized - Please sign in" });
    }

    const clerkId = auth.userId;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(401).json({ message: "User not found in database" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized - User context missing" });
  }

  const userEmail = req.user.email?.toLowerCase().trim();
  const adminEmails = ENV.ADMIN_EMAILS.map((email) =>
    email.toLowerCase().trim()
  );

  if (!adminEmails.includes(userEmail)) {
    return res.status(403).json({
      message: "Forbidden: Admins only",
    });
  }

  next();
};
