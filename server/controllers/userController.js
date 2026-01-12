import Movie from "../models/Movie.js";
import { clerkClient } from "@clerk/express";
import mongoose from "mongoose";

/* =========================
   ADD / REMOVE FAVORITE
========================= */
export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const { userId } = req.auth();

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.json({ success: false });
    }

    const user = await clerkClient.users.getUser(userId);
    let favorites = user.privateMetadata?.favorites || [];

    const index = favorites.indexOf(movieId);

    let isFavorite;
    if (index === -1) {
      favorites.push(movieId);
      isFavorite = true;
    } else {
      favorites.splice(index, 1);
      isFavorite = false;
    }

    await clerkClient.users.updateUser(userId, {
      privateMetadata: { favorites },
    });

    res.json({ success: true, isFavorite });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/* =========================
   GET FAVORITE MOVIES
========================= */
export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await clerkClient.users.getUser(userId);

    let favorites = user.privateMetadata?.favorites || [];

    const movies = await Movie.find({
      _id: { $in: favorites },
    });

    res.json({ success: true, movies });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
//1