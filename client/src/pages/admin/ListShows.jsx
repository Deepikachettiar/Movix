import React, { useState, useEffect } from "react";
import Title from "./Title";
import Loading from "../../components/Loading";
import dateFormat from "../../lib/dateFormat";
import timeFormat from "../../lib/timeFormat";
import BlurCircle from "../../components/BlurCircle";
import { useAppContext } from "../../context/appContext";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const { axios, getToken, user } = useAppContext();

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-shows", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setShows(data.shows);
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getAllShows();
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="List" text2="Shows" />

      <div className="max-w-4xl mt-6 overflow-x-auto mx-auto">
        <BlurCircle top="150px" right="-10%" />
        <BlurCircle top="20px" left="40%" />
        <BlurCircle bottom="10px" left="2%" />

        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium">Release Date</th>
              <th className="p-2 font-medium">Genre</th>
              <th className="p-2 font-medium">Runtime</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {shows.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-400">
                  No active shows found
                </td>
              </tr>
            ) : (
              shows.map((show) => (
                <tr
                  key={show._id}
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
                >
                  <td className="p-2 min-w-45 pl-5">
                    {show.movie?.title || "N/A"}
                  </td>

                  <td className="p-2">
                    {show.movie?.release_date
                      ? dateFormat(show.movie.release_date)
                      : "N/A"}
                  </td>

                  <td className="p-2">
                    {show.movie?.genres?.length
                      ? show.movie.genres
                          .slice(0, 2)
                          .map((g) => g.name)
                          .join(" | ")
                      : "N/A"}
                  </td>

                  <td className="p-2">
                    {show.movie?.runtime
                      ? timeFormat(show.movie.runtime)
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListShows;
