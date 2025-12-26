import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MoviesDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favourites from "./pages/Favourites";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import ListShows from "./pages/admin/ListShows";
import ListBookings from "./pages/admin/ListBookings";
import AddShows from "./pages/admin/AddShow.jsx";
import { useAppContext } from "./context/AppContext.jsx";
import { SignIn } from "@clerk/clerk-react";


const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const {user}=useAppContext();


  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MoviesDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/favorites" element={<Favourites />} />

        <Route path="/admin/*" element={user?<Layout/>:(
          <div className="min-h-screen flex justify-center items-center">
            <SignIn fallbackRedirectUrl={"/admin"}/>
          </div>
        )}>
          <Route index element={<Dashboard/>}/>
          <Route path="list-shows" element={<ListShows/>}/>
          <Route path="list-bookings" element={<ListBookings/>}/>
          <Route path="add-shows" element={<AddShows/>}/>
          
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
