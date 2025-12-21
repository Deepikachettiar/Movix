import express from "express";
import { getNowPlayingMovies } from "../controllers/showcontroller.js";

const showRouter = express.Router();

showRouter.get('/now-playing', getNowPlayingMovies)

export default showRouter
