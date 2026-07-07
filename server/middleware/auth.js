import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    if (!userId) {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    // Check Clerk publicMetadata first
    const clerkUser = await clerkClient.users.getUser(userId);
    if (clerkUser?.publicMetadata?.role === "admin") {
      return next();
    }

    // Fallback: check role in MongoDB
    const dbUser = await User.findById(userId);
    if (dbUser?.role === "admin") {
      return next();
    }

    return res.status(403).json({ success: false, message: "Access denied. Admins only." });

  } catch (error) {
    console.error("protectAdmin error:", error);
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
};
