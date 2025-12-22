import axios from "axios";
import Movie from "../models/movie";


//API to get now playing movies
export const getNowPlayingMovies = async (req, res)=>{
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: { Authorization : `Bearer ${process.env.TMDB_API_KEY}` }
        })

        const movies = data.results;
        res.json({success: true, movies: movies})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

//API to add a show to database
export const addShow = async (req, res)=>{
    try {
        const { movieId, showsInput,showPrice } = req.body;   
        let movie=await Movie.findById(movieId);
        if(!movie)
        {
              const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/{movie_id}`, {
                    headers: { Authorization : `Bearer ${process.env.TMDB_API_KEY}` }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: { Authorization : `Bearer ${process.env.TMDB_API_KEY}` }
                })
            ]);

            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;

            const movieDetails={
                _id:movieId,
                title:movieApiData.title,
                overview:movieApiData.overview,
                poster_path:movieApiData.poster_path,
                backdrop_path:movieApiData.backdrop_path,
                release_date:movieApiData.release_date,
                original_language:movieApiData.original_language,
                tagline:movieApiData.tagline||"",
                genres:movieApiData.genres,
                cast:movieCreditsData.cast,
                vote_avg:movieApiData.vote_average,
                runtime:movieApiData.runtime,

            }
        }
    }catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}