import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { FaClock, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaTag, FaMoneyBillWave } from "react-icons/fa"; // Added more icons for richer details
import api from "../../api/api"; // Adjust path as needed
import { getToken } from "../../utils/auth"; // Adjust path as needed
import Loader from "../../components/loader"; // Assuming you have a Loader component

export default function ProviderBookings() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [acceptedBookings, setAcceptedBookings] = useState([]); // State to hold real accepted bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to format date consistently for comparison
  const formattedDate = (date) => {
    // Ensure date is a Date object, then format
    return date instanceof Date ? date.toISOString().split("T")[0] : new Date(date).toISOString().split("T")[0];
  };

  // Fetch accepted bookings from the API
  useEffect(() => {
    const fetchAcceptedBookings = async () => {
      setLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // Fetch all provider bookings, then filter for accepted status
        // If your backend has a specific endpoint for 'accepted' bookings, use that for efficiency.
        // e.g., await api.get("/bookings/provider?status=accepted", { headers: { Authorization: `Bearer ${token}` } });
        const response = await api.get("/bookings/provider", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter the fetched bookings to include only those with 'accepted' status
        const filteredBookings = response.data.filter(
          (booking) => booking.status === "accepted"
        );
        setAcceptedBookings(filteredBookings);

      } catch (err) {
        console.error("Error fetching accepted bookings:", err);
        setError(err.response?.data?.message || "Failed to fetch accepted bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedBookings();
  }, []); // Empty dependency array means this runs once on mount

  // Filter bookings for the selected date
  const bookingsForSelectedDate = acceptedBookings.filter(
    (b) => formattedDate(b.bookingDate) === formattedDate(selectedDate)
  );

  // Calendar tile content: mark dates with accepted bookings
  const tileContent = ({ date, view }) => {
    // Check if any accepted booking exists for this specific date
    const hasBooking = acceptedBookings.some(
      (b) => formattedDate(b.bookingDate) === formattedDate(date)
    );

    if (view === "month" && hasBooking) {
      return (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
      ); // Changed color to blue for consistency
    }
    return null;
  };

  // Calendar tile class names for styling today and selected date
  const tileClassName = ({ date, view }) => {
    const today = new Date();
    const isToday = formattedDate(date) === formattedDate(today);
    const isSelected = formattedDate(date) === formattedDate(selectedDate);

    let classList = "";

    if (view === "month") {
      if (isToday) {
        classList += " bg-blue-100 text-blue-800 font-semibold ";
      }
      if (isSelected) {
        classList += " bg-[#104DA3] text-white font-semibold "; // Matches your primary blue
      }
    }
    return classList;
  };

  // Helper function to format time (assuming bookingTime is a string like "10:00 AM")
  const formatBookingTime = (timeString) => {
    // If the backend returns a full ISO date string, we can extract time from it.
    // Assuming `bookingTime` property exists and is a string, or `bookingDate` can provide it.
    if (timeString) return timeString;
    // Fallback if bookingTime isn't explicitly provided but is part of bookingDate
    // This part might need adjustment based on your actual API response structure for time.
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="text-red-700 bg-red-100 border border-red-400 p-6 rounded-lg shadow-md text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-3">Error Loading Bookings</h2>
          <p>{error}</p>
          <p className="mt-4 text-sm text-gray-600">Please try refreshing the page or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Accepted Bookings Schedule</h1>

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-full lg:w-1/2 flex justify-center items-center">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            tileContent={tileContent}
            className="w-full max-w-md md:max-w-none border-none shadow-inner p-2"
          />
        </div>

        {/* Booking List for Selected Date */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-[#104DA3] mb-6 border-b pb-4 border-gray-200">
            Bookings on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h2>

          {bookingsForSelectedDate.length === 0 ? (
            <p className="text-gray-500 text-lg py-10 text-center">No accepted bookings for this date.</p>
          ) : (
            <ul className="space-y-5">
              {bookingsForSelectedDate.map((booking) => (
                <li
                  key={booking._id} // Use _id from MongoDB
                  className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <p className="font-bold text-xl text-gray-900 mb-2">{booking.serviceType}{booking.subService ? ` - ${booking.subService}` : ''}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-gray-700 text-base">
                    <p className="flex items-center gap-2">
                      <FaUser className="text-gray-500" /> Customer: <span className="font-medium">{booking.customerId?.firstName} {booking.customerId?.lastName}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaClock className="text-gray-500" /> Time: <span className="font-medium">{formatBookingTime(booking.bookingTime)}</span>
                    </p>
                    <p className="flex items-start gap-2 col-span-1 md:col-span-2">
                      <FaMapMarkerAlt className="text-gray-500 mt-1" /> Location: <span className="font-medium">{booking.location} - {booking.addressDetails}</span>
                    </p>
                    {booking.estimatedAmount && (
                      <p className="flex items-center gap-2 text-blue-700 font-semibold text-lg col-span-1 md:col-span-2">
                        <FaMoneyBillWave className="text-blue-600" /> Estimated Amount: LKR {booking.estimatedAmount.toFixed(2)}
                      </p>
                    )}
                    {booking.description && (
                        <div className="col-span-1 md:col-span-2 text-sm text-gray-600 mt-2 bg-white p-3 rounded border border-gray-100">
                            <span className="font-semibold text-gray-800">Description: </span>{booking.description}
                        </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}