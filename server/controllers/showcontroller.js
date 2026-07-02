import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to get local seed movies
const getLocalSeedMovies = () => {
  try {
    const seedPath = path.join(__dirname, "../configs/movies_seed.json");
    return JSON.parse(fs.readFileSync(seedPath, "utf-8"));
  } catch (err) {
    console.error("Failed to read local seed movies:", err.message);
    return [];
  }
};

//API to get now playing movies
export const getNowPlayingMovies = async (req, res) => {
  try {
    // Try TMDB first, fall back to local seed data
    try {
      const { data } = await axios.get(
        "https://api.themoviedb.org/3/movie/now_playing",
        {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
          timeout: 4000
        }
      );
      if (data.results && data.results.length > 0) {
        return res.json({ success: true, movies: data.results });
      }
    } catch (tmdbErr) {
      console.warn("TMDB fetch timed out or failed, using local movies seed data", tmdbErr.message);
    }

    const localMovies = getLocalSeedMovies().map(m => ({
      id: m._id,
      title: m.title,
      poster_path: m.poster_path,
      backdrop_path: m.backdrop_path,
      vote_average: m.vote_avg,
      vote_count: 1000,
      release_date: m.release_date
    }));

    res.json({ success: true, movies: localMovies });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//API to add a show to database
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;
    let movie = await Movie.findById(movieId);
    if (!movie) {
      // Find in local seed first
      const localSeedMovie = getLocalSeedMovies().find(m => m._id === String(movieId));
      if (localSeedMovie) {
        movie = await Movie.create(localSeedMovie);
      } else {
        // Fallback to TMDB
        const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
          }),
        ]);

        const movieApiData = movieDetailsResponse.data;
        const movieCreditsData = movieCreditsResponse.data;

        const movieDetails = {
          _id: movieId,
          title: movieApiData.title,
          overview: movieApiData.overview,
          poster_path: movieApiData.poster_path,
          backdrop_path: movieApiData.backdrop_path,
          release_date: movieApiData.release_date,
          original_language: movieApiData.original_language,
          tagline: movieApiData.tagline || "",
          genres: movieApiData.genres,
          cast: movieCreditsData.cast,
          vote_avg: movieApiData.vote_average,
          runtime: movieApiData.runtime,
        };

        movie = await Movie.create(movieDetails);
      }
    }

    const showsToCreate = [];

    showsInput.forEach((show) => {
      const showDate = show.date;

      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;

        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.json({ success: true, message: "Shows added successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get shows from database
// API to get all shows from the database
export const getShows = async (req, res) => {
  try {
    // Get all upcoming shows
    const shows = await Show.find({
      showDateTime: { $gte: new Date() },
    })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // Filter unique movies from shows
    const uniqueShows = new Set(shows.map((show) => show.movie));

    res.json({
      success: true,
      shows: Array.from(uniqueShows),
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to get a single show details
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });

    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      const time = show.showDateTime
        .toISOString()
        .split("T")[1]
        .substring(0, 5);
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
        showPrice: show.showPrice,
      });
    });

    res.json({ success: true, movie, shows: dateTime });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
