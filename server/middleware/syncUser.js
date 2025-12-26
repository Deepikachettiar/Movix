import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

// Middleware: upsert Clerk user into MongoDB when a request is authenticated.
export const syncUserToDB = async (req, res, next) => {
  try {
    // req.auth may not exist for public routes
    if (!req.auth) return next();

    const auth = req.auth();
    if (!auth || !auth.userId) return next();

    const userId = auth.userId;

    // Get user from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) return next();

    const email = clerkUser.emailAddresses?.[0]?.emailAddress || clerkUser.email_addresses?.[0]?.email_address;
    const name = [clerkUser.firstName || clerkUser.first_name, clerkUser.lastName || clerkUser.last_name]
      .filter(Boolean)
      .join(" ");
    const image = clerkUser.imageUrl || clerkUser.image_url || clerkUser.profileImageUrl || clerkUser.profile_image_url;

    const update = {
      _id: userId,
      ...(email && { email }),
      ...(name && { name }),
      ...(image && { image }),
    };

    console.log(`syncUserToDB: syncing Clerk user ${userId} to DB`, { email, name });

    try {
      const doc = await User.findByIdAndUpdate(userId, update, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
      console.log(`syncUserToDB: upserted user ${doc._id}`);
    } catch (err) {
      // Handle duplicate key (e.g., same email exists under different _id)
      if (err && err.code === 11000 && email) {
        console.warn(`syncUserToDB: duplicate key error when upserting user ${userId} (email conflict). Attempting to update existing document by email.`);
        const existing = await User.findOne({ email });
        if (existing) {
          const updated = await User.findByIdAndUpdate(
            existing._id,
            { ...update, _id: existing._id },
            { new: true }
          );
          console.log(`syncUserToDB: updated existing user by email ${existing._id}`);
        } else {
          console.error("syncUserToDB: duplicate key but no existing doc found for email", email);
        }
      } else {
        throw err; // rethrow to outer catch
      }
    }

    next();
  } catch (error) {
    console.error("syncUserToDB error:", error);
    // Do not block requests if sync fails
    next();
  }
};
