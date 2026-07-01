import express from "express";
import { updateFavorite, getFavorites, getUserBookings } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/update-favorite", updateFavorite);
userRouter.get("/favorites", getFavorites);
userRouter.get("/bookings", getUserBookings);

export default userRouter;