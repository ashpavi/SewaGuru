import React from "react";
import { FaUserShield, FaUser } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";

const messages = [
  // {
  //   id: 1,
  //   senderType: "Admin",
  //   senderName: "Admin Team",
  //   message: "Please update your service availability by Friday.",
  //   time: "2024-05-01 09:30 AM",
  // },
  // {
  //   id: 2,
  //   senderType: "Customer",
  //   senderName: "Nimal Perera",
  //   message: "Can you reschedule my plumbing appointment?",
  //   time: "2024-05-02 02:45 PM",
  // },
  // {
  //   id: 3,
  //   senderType: "Admin",
  //   senderName: "Admin Team",
  //   message: "New policy update: Ensure profile verification is complete.",
  //   time: "2024-05-03 11:00 AM",
  // },
]; // Currently empty for demonstration

export default function ProviderMessages() {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Your Inbox</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-[#104DA3] mb-5 border-b pb-3 border-gray-200">Recent Messages</h2>

        {messages.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-lg italic">
            <p>No messages yet. Your inbox is sparkling clean! ✨</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="py-4 px-3 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-blue-50 transition duration-200 ease-in-out rounded-md"
              >
                {/* Left Side: Icon + Info */}
                <div className="flex items-center gap-4">
                  <div className="text-2xl text-[#104DA3] flex-shrink-0">
                    {msg.senderType === "Admin" ? <FaUserShield /> : <FaUser />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{msg.senderName}</p>
                    <p className="text-sm text-gray-600 truncate max-w-[calc(100vw-180px)] md:max-w-md lg:max-w-xl">
                      {msg.message}
                    </p>
                  </div>
                </div>

                {/* Right Side: Time + Badge */}
                <div className="flex flex-col items-end mt-3 md:mt-0 md:ml-4 flex-shrink-0">
                  <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                    <MdAccessTime className="text-sm" /> {msg.time}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      msg.senderType === "Admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {msg.senderType}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}