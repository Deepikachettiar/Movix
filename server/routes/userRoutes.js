import express from "express";
import { updateFavorite, getFavorites } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/update-favorite", updateFavorite);
userRouter.get("/favorites", getFavorites);

export default userRouter;
//1