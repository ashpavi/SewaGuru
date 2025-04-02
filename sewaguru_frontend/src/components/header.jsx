import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#48B8E3] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex items-center justify-between relative">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img
            src={logo}
            alt="SewaGuru Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Nav Links & Buttons */}
        <div
          className={`flex flex-col md:flex-row items-start md:items-center md:gap-6 absolute md:static top-full left-0 w-full md:w-auto bg-[#48B8E3] md:bg-transparent px-6 py-4 md:py-0 transition-all duration-300 z-10 ${
            menuOpen ? "flex" : "hidden"
          } md:flex`}
        >
          {/* Navigation */}
          <ul className="flex flex-col md:flex-row gap-3 md:gap-6 text-sm font-medium uppercase w-full md:w-auto">
            <Link to="/" className="hover:text-yellow-300">Home</Link>
            <Link to="/ourServices" className="hover:text-yellow-300">Our Services</Link>
            <Link to="/privacyPolicy" className="hover:text-yellow-300">Privacy Policy</Link>
            <Link to="/aboutUs" className="hover:text-yellow-300">About Us</Link>
            <Link to="/contactUs" className="hover:text-yellow-300">Contact Us</Link>
          </ul>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 mt-4 md:mt-0 md:ml-8 w-full md:w-auto">
            <Link
              to="/becomeGuru"
              className="bg-orange-500 hover:bg-orange-600 text-black font-medium px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition text-center"
            >
              Become a SewaGuru
            </Link>
            <Link
              to="/SignIn"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition text-center"
            >
              Log In / Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
