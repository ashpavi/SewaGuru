import { useState } from "react";
import { FaBookOpen, FaEnvelope, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import api from "../../api/api";
import Footer from "../../components/Footer";
import Header from "../../components/header";
import { getToken } from "../../utils/auth";
import ProfileDetails from "./ProfileDetails";
import UserBookings from "./userBookings";
import UserMessages from "./UserMessages";

export default function ProfileDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = async () => {
    const token = getToken();
    try {
      await api.post("/user/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/logIn");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/logIn");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      {/* Header fixed at the top */}
      <Header />

      {/* Main Dashboard Section */}
      <main className="flex-grow flex justify-center items-start py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-6xl space-y-8"
        >
          {/* Dashboard Heading */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-[#104DA3]">My Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-6 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* Tabs for navigation */}
          <div className="flex flex-wrap justify-center gap-4 border-b pb-4">
            <TabButton
              icon={<FaUser />}
              label="Profile Details"
              isActive={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <TabButton
              icon={<FaBookOpen />}
              label="Active Bookings"
              isActive={activeTab === "bookings"}
              onClick={() => setActiveTab("bookings")}
            />
            <TabButton
              icon={<FaEnvelope />}
              label="Messages"
              isActive={activeTab === "messages"}
              onClick={() => setActiveTab("messages")}
            />
          </div>

          {/* Tab Content */}
          <div className="pt-6">
            {activeTab === "profile" && <ProfileDetails />}
            {activeTab === "bookings" && <UserBookings />}
            {activeTab === "messages" && <UserMessages />}
          </div>
        </motion.div>
      </main>

      {/* Footer fixed at the bottom */}
      <Footer />
    </div>
  );
}

// Tab button component
function TabButton({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition ${isActive
        ? "bg-blue-500 text-white shadow-md"
        : "bg-gray-100 text-gray-700 hover:bg-blue-100"
        }`}
    >
      {icon} {label}
    </button>
  );
}
