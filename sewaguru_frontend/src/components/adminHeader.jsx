import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import api from "../api/api";

export default function AdminHeader() {
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
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <img src={logo} alt="SewaGuru Logo" className="h-12 w-auto object-contain" />
        </Link>

        {/* Title */}
        <div className="hidden md:flex items-center gap-2">
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>

        {/* Hamburger Toggle Button (Mobile) */}
        <button
          className="md:hidden text-3xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-4"> 
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-4 bg-[#48B8E3] border-t border-white/20">
          <h1 className="text-xl font-semibold mb-2">Admin</h1>
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
