import React from "react";
import { FaUserShield, FaUser } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";

const messages = [
  {
    id: 1,
    senderType: "Admin",
    senderName: "Admin Team",
    message: "Please update your service availability by Friday.",
    time: "2024-05-01 09:30 AM",
  },
  {
    id: 2,
    senderType: "Customer",
    senderName: "Nimal Perera",
    message: "Can you reschedule my plumbing appointment?",
    time: "2024-05-02 02:45 PM",
  },
  {
    id: 3,
    senderType: "Admin",
    senderName: "Admin Team",
    message: "New policy update: Ensure profile verification is complete.",
    time: "2024-05-03 11:00 AM",
  },
];

export default function ProviderMessages() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Messages</h1>

      <div className="bg-white p-5 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-[#104DA3] mb-4">Inbox</h2>

        <ul className="divide-y divide-gray-200">
          {messages.map((msg) => (
            <li key={msg.id} className="py-4 px-2 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50 transition">
              {/* Left Side: Icon + Info */}
              <div className="flex items-center gap-4">
                <div className="text-2xl text-[#104DA3]">
                  {msg.senderType === "Admin" ? <FaUserShield /> : <FaUser />}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{msg.senderName}</p>
                  <p className="text-sm text-gray-600 truncate max-w-[300px]">{msg.message}</p>
                </div>
              </div>

              {/* Right Side: Time + Badge */}
              <div className="flex flex-col items-end mt-2 md:mt-0">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <MdAccessTime /> {msg.time}
                </span>
                <span className={`text-xs mt-1 px-3 py-1 rounded-full font-medium ${
                  msg.senderType === "Admin"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {msg.senderType}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
