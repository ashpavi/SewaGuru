import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import api from "../api/api";

export default function ProviderHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Logout token:", token);
      await api.post("/user/logout",null, {
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
    <header className="bg-[#48B8E3] text-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-3 flex items-center justify-between relative">
        
        {/* Logo */}
        <Link to="/provider/providerDashboard" className="flex items-center gap-2 flex-shrink-0">
          <img
            src={logo}
            alt="SewaGuru Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Centered Title (desktop) */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-bold text-white whitespace-nowrap">
            SewaGuru Service Provider
          </h1>
        </div>

        {/* Title (visible in mobile as well) */}
        <div className="md:hidden flex-1 text-center">
          <h1 className="text-base font-semibold text-white">
            SewaGuru Provider
          </h1>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-3xl focus:outline-none"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop Logout Button */}
        <div className="hidden md:flex">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#48B8E3] px-4 py-3">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-full text-sm shadow-md transition"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
