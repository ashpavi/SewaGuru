import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#48B8E3] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex items-center justify-between relative">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src={logo}
            alt="SewaGuru Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links + Buttons */}
        <div className={`flex flex-col md:flex-row items-start md:items-center md:gap-6 absolute md:static top-full left-0 w-full md:w-auto bg-[#48B8E3] md:bg-transparent px-6 md:px-0 py-4 md:py-0 transition-all duration-300 z-10 ${menuOpen ? 'flex' : 'hidden'} md:flex`}>
          
          {/* Nav Links */}
          <ul className="flex flex-col md:flex-row gap-3 md:gap-6 text-sm font-medium uppercase w-full md:w-auto">
            <Link to="/" className="hover:text-[#FDCB02]">Home</Link>
            <Link to="/ourServices" className="hover:text-[#FDCB02]">Our Services</Link>
            <Link to="/privacyPolicy" className="hover:text-[#FDCB02]">Privacy Policy</Link>
            <Link to="/aboutUs" className="hover:text-[#FDCB02]">About Us</Link>
            <Link to="/contactUs" className="hover:text-[#FDCB02]">Contact Us</Link>
          </ul>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 mt-4 md:mt-0 md:ml-8 w-full md:w-auto">
          <Link
            to="/becomeGuru"
            className="w-full md:w-auto text-center bg-orange-500 hover:bg-orange-600 text-black font-medium px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition"
          >
            Become a SewaGuru
          </Link>
          <Link
            to="/SignIn"
            className="w-full md:w-auto text-center bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition"
          >
            Log In / Sign Up
          </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
