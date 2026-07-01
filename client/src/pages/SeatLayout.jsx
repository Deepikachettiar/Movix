import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import isoTimeFormat from "../lib/isoTimeFormat";
import { ClockIcon } from "lucide-react";
import toast from "react-hot-toast";
import BlurCircle from "../components/BlurCircle";
import {assets} from "../assets/assets";
import { ArrowRightIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";


const SeatLayout = () => {
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const { axios, getToken, user } = useAppContext();

  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const navigate = useNavigate();

  const getShowDetails = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load show details");
    }
  };

  const fetchOccupiedSeats = async (showId) => {
    try {
      const { data } = await axios.get(`/api/booking/seats/${showId}`);
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedTime?.showId) {
      fetchOccupiedSeats(selectedTime.showId);
    } else {
      setOccupiedSeats([]);
    }
    setSelectedSeats([]);
  }, [selectedTime]);

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isOccupied = occupiedSeats.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);
          return (
            <button
              key={seatId}
              disabled={isOccupied}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border text-xs cursor-pointer flex items-center justify-center transition
                ${isOccupied ? "bg-red-900/40 border-red-900/60 text-red-500 cursor-not-allowed opacity-50" : 
                  isSelected ? "bg-primary text-white border-primary" : "border-primary/60 hover:bg-primary/20 text-gray-200"}`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select a show time first");
    }

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can select a maximum of 5 seats");
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const handleProceedToPay = async () => {
    if (!user) {
      return toast.error("Please login to proceed");
    }
    if (!selectedTime) {
      return toast.error("Please select a show time");
    }
    if (selectedSeats.length === 0) {
      return toast.error("Please select at least one seat");
    }

    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/booking/create",
        {
          showId: selectedTime.showId,
          selectedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Redirecting to checkout...");
        if (data.session_url) {
          window.location.href = data.session_url;
        } else {
          navigate("/mybookings");
        }
      } else {
        toast.error(data.message || "Failed to create booking");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to proceed to payment");
    }
  };

  useEffect(() => {
    getShowDetails();
  }, [id]);

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      {/* Available Timings */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {show.shows && show.shows[date] ? (
            show.shows[date].map((item) => (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                  selectedTime?.time === item.time
                    ? "bg-primary text-white"
                    : "hover:bg-primary/20"
                }`}
              >
                <ClockIcon className="w-4 h-4" />
                <p className="text-sm">{isoTimeFormat(item.time)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 px-6 mt-2">No shows scheduled for this date</p>
          )}
        </div>
      </div>

      {/* Seat Layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />

        <h1 className="text-2xl font-semibold mb-4">Select your seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>

          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeats(row))}</div>
            ))}
          </div>
        </div>

        <button
          onClick={handleProceedToPay}
          className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95"
        >
          Proceed To Pay
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
