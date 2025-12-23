import { use } from "react";
import Booking from "../models/Booking.js";
import {clerkClient} from "@clerk/express"

// API Controller Function to Get User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const user = req.auth().userId;

    const bookings = await Booking.find({ user })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};



// API Controller Function to Add Favorite Movie in Clerk User Metadata
export const addFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);

    if(!user.privateMetadata.favorites) {
        user.privateMetadata.favorites = [];
    }

    if (!user.privateMetadata.favorites.includes(movieId)) {
      !user.privateMetadata.favorites.push(movieId);
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        favorites,
      },
    });

    res.json({ success: true, message: "Favorite added successfully." });

} catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};


// API Controller Function to update Favorite Movie in Clerk User Metadata
export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);

    if(!user.privateMetadata.favorites) {
        user.privateMetadata.favorites = [];
    }

    if (!user.privateMetadata.favorites.includes(movieId)) {
      !user.privateMetadata.favorites.push(movieId);
    }else{
        user.privateMetadata.favorites = user.privateMetadata.favorites.filter(id => id !== movieId);
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        favorites,
      },
    });

    res.json({ success: true, message: "Favorite updated successfully." });

} catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};


export const getFavorites = async (req, res) => {
  try {
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);

    const favorites = user.privateMetadata?.favorites || [];

    if (favorites.length === 0) {
      return res.json({ success: true, movies: [] });
    }

    // Getting movies from database
    const movies = await Movie.find({
      _id: { $in: favorites }
    });

    res.json({ success: true, movies });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};