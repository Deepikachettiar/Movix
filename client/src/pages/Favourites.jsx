import React, { useEffect } from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

const Favourites = () => {
  const { favoriteMovies, fetchFavoriteMovies } = useAppContext();

  useEffect(() => {
    fetchFavoriteMovies();
  }, []);

  if (!favoriteMovies.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">No Movies Found</h1>
      </div>
    );
  }

  return (
    <div className="relative my-40 px-6 md:px-16 lg:px-40 min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className="text-lg font-medium mb-6">
        Your Favourite Movies
      </h1>

      <div className="flex flex-wrap gap-6">
        {favoriteMovies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Favourites;
//1