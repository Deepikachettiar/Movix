import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlayCircleIcon, Heart, StarIcon } from "lucide-react";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MovieDetails = () => {
  const {
    shows,
    axios,
    getToken,
    user,
    fetchFavoriteMovies,
    favoriteMovies,
    image_base_url,
  } = useAppContext();

  const { id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch movie from backend
  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        // Ensure dateTime is always an object
        setShow({ ...data, dateTime: data.dateTime || {} });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Sync favorite state
  useEffect(() => {
    if (favoriteMovies && show?.movie?._id) {
      setIsFavorite(
        favoriteMovies.some((movie) => movie._id === show.movie._id)
      );
    }
  }, [favoriteMovies, show]);

  // Like / Unlike
  const handleFavorite = async () => {
    if (!user) return toast.error("Please login");

    try {
      const { data } = await axios.post(
        "/api/user/update-favorite",
        { movieId: show.movie._id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        await fetchFavoriteMovies();
        toast.success(
          data.isFavorite ? "Added to favorites" : "Removed from favorites"
        );
      }
    } catch (error) {
      toast.error("Failed to update favorite");
      console.error(error);
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  if (!show) return <Loading />;

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={image_base_url + show.movie.poster_path}
          alt={show.movie.title}
          className="rounded-xl h-104 max-w-70 object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />

          <h1 className="text-4xl font-semibold">{show.movie.title}</h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-4 h-4 text-primary fill-primary" />
            {show.movie.vote_average
              ? `${Number(show.movie.vote_average).toFixed(1)} User Rating`
              : "Rating not available"}
          </div>

          <p className="text-gray-400 max-w-xl">{show.movie.overview}</p>

          <p className="text-gray-300 text-sm">
            {timeFormat(show.movie.runtime)} •{" "}
            {show.movie.genres?.map((g) => g.name).join(", ")} •{" "}
            {show.movie.release_date.split("-")[0]}
          </p>

          <div className="flex items-center gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 bg-gray-800 rounded-md">
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>

            <button onClick={handleFavorite} className="bg-gray-700 p-2.5 rounded-full">
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Safe rendering of DateSelect */}
      {show.dateTime && <DateSelect dateTime={show.dateTime} id={id} />}

      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>

      <div className="flex flex-wrap gap-8">
        {shows.slice(0, 4).map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            window.scrollTo(0, 0);
          }}
          className="px-10 py-3 bg-primary rounded-md"
        >
          Show more
        </button>
      </div>
    </div>
  );
};

export default MovieDetails;
//3