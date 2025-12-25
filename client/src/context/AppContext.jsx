import { createContext,useContext, useEffect } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation,useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { use } from "react";

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
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};



useEffect(() => {
    if(user){
        fetchIsAdmin();
    }
},[]);

    const value = {axios};

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);