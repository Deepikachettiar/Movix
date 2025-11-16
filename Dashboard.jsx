// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  UsersIcon,
} from "lucide-react";
import Loading from "../../components/Loading";
import Title from "./Title";
import BlurCircle from "../../components/BlurCircle";
import dateFormat from "../../lib/dateFormat";
import { dummyDashboardData } from "../../assets/assets";
import { StarIcon } from "lucide-react";

const currency = import.meta.env.VITE_CURRENCY;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });

  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || "0",
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: currency+dashboardData.totalRevenue || "0",
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length || "0",
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || "0",
      icon: UsersIcon,
    },
  ];

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData(); 
  }, []);

return !loading ? (
  <>
    <Title text1="Admin" text2="Dashboard" />
    <div className="flex">
      <BlurCircle top="100px" right="-10%" />
      <BlurCircle top="50px" left="35%" />
      <div className="flex-1 p-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="bg-primary/10 border border-primary/20 p-5 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <card.icon className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <h2 className="text-xl font-semibold">{card.value}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Shows Section */}
        <p className="mt-10 text-lg font-medium">Active Shows</p>
        <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
          <BlurCircle top="100px" left="-10%" />
          {dashboardData.activeShows.map((show) => (
            <div
              key={show._id}
              className="w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:translate-y-1 transition duration-300"
            >
              <img
                src={show.movie.poster_path}
                alt=""
                className="h-60 w-full object-cover"
              />
              <p className="font-medium p-2 truncate">{show.movie.title}</p>
              <div className="flex items-center justify-between px-2">
                <p className="text-lg font-medium">
                  {currency} {show.showPrice}
                </p>
                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                  <StarIcon className="w-4 h-4 text-primary fill-primary" />
                  {show.movie.vote_average.toFixed(1)}
                </p>
              </div>
              <p className="px-2 pt-2 text-sm text-gray-500">
                {dateFormat(show.showDateTime)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
) : (
  <Loading />
);
}

export default Dashboard;
