import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { jwtDecode } from "jwt-decode";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstLetter, setFirstLetter] = useState("U"); // default letter
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsLoggedIn(true);

      try {
        const decoded = jwtDecode(token);
        const userFirstName = decoded.firstName || "U"; // firstName must be included in token
        setFirstLetter(userFirstName.charAt(0).toUpperCase());
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  const handleProfileClick = () => {
    navigate("/client/profileDashboard");
  };

  return (
    <header className="w-full h-[70px] bg-[#48B8E3] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex items-center justify-between relative">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-1">
          <img
            src={logo}
            alt="SewaGuru Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Action Buttons (Mobile) */}
        <div className="flex md:hidden gap-2 text-xs">
          {isLoggedIn ? (
            <button
              onClick={handleProfileClick}
              className="bg-white text-[#48B8E3] rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-md hover:shadow-lg transition"
            >
              {firstLetter}
            </button>
          ) : (
            <>
              <Link
                to="/provider/providerRegister"
                className="bg-green-500 hover:bg-green-600 text-white font-medium px-3 py-1.5 text-center rounded-full shadow-md hover:shadow-lg transition"
              >
                Become a SewaGuru
              </Link>
              <Link
                to="/logIn"
                className="bg-white text-[#48B8E3] hover:bg-blue-100 font-medium text-center px-3 py-1.5 rounded-full shadow-md hover:shadow-lg transition"
              >
                Log In / Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl focus:outline-none ml-3"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Nav Links */}
        <div
          className={`flex flex-col md:flex-row items-start md:items-center md:gap-6 absolute md:static top-full left-0 w-full md:w-auto bg-[#48B8E3] md:bg-transparent px-6 py-4 md:py-0 transition-all duration-300 z-10 ${
            menuOpen ? "flex" : "hidden"
          } md:flex`}
        >
          {/* Navigation */}
          <ul className="flex flex-col md:flex-row gap-3 md:gap-6 text-sm font-medium uppercase w-full md:w-auto">
            <Link to="/" className="hover:text-[#104DA3]">Home</Link>
            <Link to="/client/ourServices" className="hover:text-[#104DA3]">Our Services</Link>
            <Link to="/client/privacyPolicy" className="hover:text-[#104DA3]">Privacy Policy</Link>
            <Link to="/client/aboutUs" className="hover:text-[#104DA3]">About Us</Link>
            <Link to="/client/contactUs" className="hover:text-[#104DA3]">Contact Us</Link>
          </ul>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex flex-col md:flex-row gap-6 mt-4 md:mt-0 md:ml-8 w-full md:w-auto items-center">
            {isLoggedIn ? (
              <button
                onClick={handleProfileClick}
                className="bg-white text-[#48B8E3] rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-md hover:shadow-lg transition"
              >
                {firstLetter}
              </button>
            ) : (
              <>
                <Link
                  to="/provider/providerRegister"
                  className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition text-center"
                >
                  Become a SewaGuru
                </Link>
                <Link
                  to="/logIn"
                  className="bg-[#104DA3] hover:bg-[#334E73] text-white font-medium px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition text-center"
                >
                  Log In / Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
