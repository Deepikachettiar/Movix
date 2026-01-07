import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();


  const showsFetchedRef = useRef(false);
  const authFetchedRef = useRef(false);
  const showsToastRef = useRef(false);
  const favoritesToastRef = useRef(false);
const fetchIsAdmin = async () => {

  if (!location.pathname.startsWith("/admin")) return;

  try {
    const token = await getToken();
    if (!token) return;

    const { data } = await axios.get("/api/admin/is-admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setIsAdmin(data.isAdmin);

    if (!data.isAdmin) {
      navigate("/");
      toast.error("Access denied. Admins only.");
    }
  } catch (error) {
    if (error.response?.status !== 403) {
      console.error("Error fetching admin status:", error);
    }
  }
};


  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");

      if (data && data.success) {
        setShows(data.shows);
      } else if (!showsToastRef.current && typeof data === "object") {
        showsToastRef.current = true;
        toast.error(data?.message || "Failed to load shows");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      const { data } = await axios.get("/api/user/favorites", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data && data.success) {
        setFavoriteMovies(data.movies);
      } else if (!favoritesToastRef.current && typeof data === "object") {
        favoritesToastRef.current = true;
        toast.error(data?.message || "Failed to load favorite movies");
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    if (showsFetchedRef.current) return;
    showsFetchedRef.current = true;

    fetchShows();
  }, []);


  useEffect(() => {
    if (!user || authFetchedRef.current) return;

    authFetchedRef.current = true;
    fetchIsAdmin();
    fetchFavoriteMovies();
  }, [user]);

  const value = {
    axios,
    fetchIsAdmin,
    shows,
    user,
    getToken,
    isAdmin,
    favoriteMovies,
    fetchFavoriteMovies,
    navigate,
    image_base_url
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
