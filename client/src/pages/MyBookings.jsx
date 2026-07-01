import React, { useEffect } from "react";
import dateFormat from "../lib/dateFormat";
import timeFormat from "../lib/timeFormat";
import BlurCircle from "../components/BlurCircle";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [bookings, setBookings] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const getMyBookings = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message || "Failed to load bookings");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while loading bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = async (bookingId) => {
    try {
      const { data } = await axios.post("/api/booking/confirm-payment", { bookingId });
      if (data.success) {
        toast.success(data.message);
        getMyBookings();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to confirm payment");
    }
  };

  const processSearchParams = async () => {
    const success = searchParams.get("success");
    const bookingId = searchParams.get("bookingId");
    if (success === "true" && bookingId) {
      // confirm mock payment
      try {
        const { data } = await axios.post("/api/booking/confirm-payment", { bookingId });
        if (data.success) {
          toast.success("Payment checkout completed!");
        }
      } catch (err) {
        console.error(err);
      }
      // clear search params
      setSearchParams({});
    }
  };

  useEffect(() => {
    if (user) {
      processSearchParams().then(() => {
        getMyBookings();
      });
    }
  }, [user]);

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-400">You don't have any bookings yet.</p>
      ) : (
        bookings.map((item, index) => (
          <div
            key={index}
            className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'
          >
            <div className='flex flex-col md:flex-row'>
              <img
                src={item.show?.movie?.poster_path ? `${import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/original'}${item.show.movie.poster_path}` : ''}
                alt=''
                className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'
              />
              <div className='flex flex-col p-4'>
                <p className='text-lg font-semibold'>{item.show?.movie?.title || "N/A"}</p>
                <p className='text-gray-400 text-sm'>
                  {item.show?.movie?.runtime ? timeFormat(item.show.movie.runtime) : ""}
                </p>
                <p className='text-gray-400 text-sm mt-auto'>
                  {item.show?.showDateTime ? dateFormat(item.show.showDateTime) : ""}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:items-end md:text-right justify-between p-4">
              <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold mb-3">
                  {currency}
                  {item.amount}
                </p>

                {item.isPaid ? (
                  <span className="bg-green-600/30 text-green-400 px-4 py-1.5 mb-3 text-sm rounded-full font-medium">
                    Paid
                  </span>
                ) : (
                  <button 
                    onClick={() => handleConfirmPayment(item._id)}
                    className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer"
                  >
                    Pay Now
                  </button>
                )}
              </div>

              <div className="text-sm">
                <p>
                  <span className="text-gray-400">Total Tickets:</span>{" "}
                  {item.bookedSeats.length}
                </p>
                <p>
                  <span className="text-gray-400">Seat Numbers:</span>{" "}
                  {item.bookedSeats.join(", ")}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default MyBookings;
