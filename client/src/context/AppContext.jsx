import { createContext,useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation,useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL ;


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [shows, setShows] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const {user}=useUser();
    const {getToken}=useAuth();
    const location = useLocation()
    const navigate = useNavigate();
    const showsErrorToastRef = useRef(false);
    const favoritesErrorToastRef = useRef(false);

const fetchIsAdmin = async () => {
  try {
    const {data} = await axios.get('/api/admin/is-admin',
        {headers:{Authorization:`Bearer ${await getToken()}`}});
        setIsAdmin(data.isAdmin);

        if(!data.isAdmin && location.pathname.startsWith('/admin')){
            navigate('/');
            toast.error("Access denied. Admins only.");
        }

  } catch (error) {
    console.error("Error fetching admin status:", error);
  }
}

const fetchShows = async () => {
  try {
    const { data } = await axios.get("/api/show/all");

    if (data.success) {
      setShows(data.shows);
      showsErrorToastRef.current = false;
      toast.dismiss("fetch-shows-error");
    } else {
      // Only show toast once per error cycle (prevent React Strict Mode double-call)
      if (!showsErrorToastRef.current && user) {
        toast.error(data?.message || "Failed to load shows", { id: "fetch-shows-error" });
        showsErrorToastRef.current = true;
      }
    }
  } catch (error) {
    console.error(error);
    // Only show toast once per error cycle when user is logged in
    if (!showsErrorToastRef.current && user) {
      toast.error("Failed to load shows", { id: "fetch-shows-error" });
      showsErrorToastRef.current = true;
    }
  }
};

const fetchFavoriteMovies = async () => {
  try {
    const { data } = await axios.get("/api/user/favorites", {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    if (data.success) {
      setFavoriteMovies(data.movies);
      favoritesErrorToastRef.current = false;
      toast.dismiss("fetch-favorites-error");
    } else {
      // Only show toast once per error cycle (prevent React Strict Mode double-call)
      if (!favoritesErrorToastRef.current) {
        toast.error(data?.message || "Failed to load favorite movies", { id: "fetch-favorites-error" });
        favoritesErrorToastRef.current = true;
      }
    }
  } catch (error) {
    console.error(error);
    // Only show toast once per error cycle
    if (!favoritesErrorToastRef.current) {
      toast.error("Failed to load favorite movies", { id: "fetch-favorites-error" });
      favoritesErrorToastRef.current = true;
    }
  }
};




useEffect(() => {
    fetchShows();
},[])

useEffect(() => {
    if(user){
        fetchIsAdmin();
        fetchFavoriteMovies();
    }
},[user]);

    const value = {
        axios,
        fetchIsAdmin,
        shows,
        user,
        getToken,
        isAdmin,
        favoriteMovies,
        fetchFavoriteMovies,
        navigate
    };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);