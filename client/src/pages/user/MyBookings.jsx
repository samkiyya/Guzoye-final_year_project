import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const { currentUser } = useSelector((state) => state.user);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllBookings = async () => {
    if (!currentUser?._id) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/booking/${currentUser._id}?searchTerm=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentBookings(data.bookings);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      setError("An error occurred while fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [searchTerm]);

  const handleCancel = async (id) => {
    if (!currentUser?._id) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/booking/cancel-booking/${id}/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        getAllBookings();
      } else {
        alert(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      alert("An error occurred while canceling the booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] shadow-xl rounded-lg p-3 flex flex-col gap-2">
        {loading && <h1 className="text-center text-2xl">Loading...</h1>}
        {error && (
          <h1 className="text-center text-2xl text-red-600">{error}</h1>
        )}
        <div className="w-full border-b-4">
          <input
            className="border rounded-lg p-2 mb-2"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {!loading && currentBookings.length > 0
          ? currentBookings.map((booking) => (
              <div
                className="w-full border-y-2 p-3 flex flex-wrap overflow-auto gap-3 items-center justify-between"
                key={booking._id}
              >
                <Link to={`/package/${booking.packageDetails._id}`}>
                  <img
                    className="w-12 h-12"
                    src={booking.packageDetails.packageImages[0]}
                    alt="Package Image"
                  />
                </Link>
                <Link to={`/package/${booking.packageDetails._id}`}>
                  <p className="hover:underline">
                    {booking.packageDetails.packageName}
                  </p>
                </Link>
                <p>{booking.buyer.username}</p>
                <p>{booking.buyer.email}</p>
                <p>{booking.date}</p>
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="p-2 rounded bg-red-600 text-white hover:opacity-95"
                >
                  Cancel Booking
                </button>
              </div>
            ))
          : !loading && <div className="text-center">No bookings found</div>}
      </div>
    </div>
  );
};

export default MyBookings;
