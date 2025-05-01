import React from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";

const requests = [
  {
    id: 1,
    serviceType: "Air Conditioner Repair",
    customerName: "Nimal Perera",
    date: "May 3, 2024",
    time: "10:00 AM",
    location: "Colombo 05",
    notes: "AC unit not cooling properly. Please bring spare filters.",
  },
  {
    id: 2,
    serviceType: "Plumbing",
    customerName: "Isuru Silva",
    date: "May 4, 2024",
    time: "2:00 PM",
    location: "Nugegoda",
    notes: "Bathroom leak under sink. Needs urgent fix.",
  },
];

export default function ServiceRequest() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Service Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-600">No new service requests at the moment.</p>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-xl shadow-md p-5 space-y-4 border-l-4 border-blue-400"
            >
              <div className="flex justify-between items-start flex-wrap">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-[#104DA3]">{req.serviceType}</h2>
                  <p className="text-gray-700">Customer: {req.customerName}</p>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <FaCalendarAlt /> {req.date}
                    <FaClock className="ml-4" /> {req.time}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <FaMapMarkerAlt /> {req.location}
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex gap-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    Accept
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    Decline
                  </button>
                </div>
              </div>

              {req.notes && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  <span className="font-medium text-gray-700">Notes: </span>
                  {req.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

