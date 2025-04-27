import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaBookOpen, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

// Components for different sections
import ProfileDetails from "./ProfileDetails";
import UserBookings from "./userBookings.jsx";
import UserMessages from "./UserMessages";
import Header from "../../components/header.jsx";
import Footer from "../../components/Footer.jsx";

export default function ProfileDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("refreshToken");
    navigate("/logIn");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center px-4 py-10">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-5xl space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-3xl font-bold text-[#104DA3]">My Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-5 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition mt-4 md:mt-0"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 border-b pb-4">
          <TabButton icon={<FaUser />} label="Profile Details" isActive={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <TabButton icon={<FaBookOpen />} label="Active Bookings" isActive={activeTab === "bookings"} onClick={() => setActiveTab("bookings")} />
          <TabButton icon={<FaEnvelope />} label="Messages" isActive={activeTab === "messages"} onClick={() => setActiveTab("messages")} />
        </div>

        {/* Content */}
        <div className="pt-6">
          {activeTab === "profile" && <ProfileDetails />}
          {activeTab === "bookings" && <UserBookings />}
          {activeTab === "messages" && <UserMessages />}
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}

// Tab button component
function TabButton({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
        isActive
          ? "bg-blue-500 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-blue-100"
      }`}
    >
      {icon} {label}
    </button>
  );
}
