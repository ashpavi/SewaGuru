import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { FaClock, FaUser, FaMapMarkerAlt } from "react-icons/fa";

// Mock accepted bookings data
const bookings = [
  {
    id: 1,
    date: "2024-05-03",
    customer: "Nimal Perera",
    service: "AC Repair",
    time: "10:00 AM",
    location: "Colombo 05",
  },
  {
    id: 2,
    date: "2024-05-03",
    customer: "Isuru Silva",
    service: "Plumbing",
    time: "2:00 PM",
    location: "Nugegoda",
  },
  {
    id: 3,
    date: "2024-05-05",
    customer: "Chamari Jayasinghe",
    service: "Washing Machine Repair",
    time: "11:00 AM",
    location: "Maharagama",
  },
];

export default function ProviderBookings() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const selectedBookings = bookings.filter(
    (b) => b.date === formattedDate(selectedDate)
  );

  const tileContent = ({ date, view }) => {
    const isBooked = bookings.some(
      (b) => b.date === formattedDate(date)
    );

    if (view === "month" && isBooked) {
      return (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
      );
    }
    return null;
  };

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
        classList += " bg-[#104DA3] text-white font-semibold ";
      }
    }

    return classList;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Accepted Bookings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-md p-4 w-full lg:w-1/2">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            tileContent={tileContent}
            className="w-full border-none"
          />
        </div>

        {/* Booking List */}
        <div className="flex-1 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-[#104DA3] mb-4">
            Bookings on {selectedDate.toDateString()}
          </h2>

          {selectedBookings.length === 0 ? (
            <p className="text-gray-500">No accepted bookings for this date.</p>
          ) : (
            <ul className="space-y-4">
              {selectedBookings.map((booking) => (
                <li
                  key={booking.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <p className="font-semibold text-gray-800">{booking.service}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FaUser /> {booking.customer}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FaClock /> {booking.time}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FaMapMarkerAlt /> {booking.location}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
