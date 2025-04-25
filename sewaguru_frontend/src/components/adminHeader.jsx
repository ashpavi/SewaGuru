import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function AdminHeader() {
  

  return (
    <header className="bg-[#48B8E3] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex items-center justify-between relative">

        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <img
            src={logo}
            alt="SewaGuru Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Admin</h1>
        </div>

       
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 mt-4 md:mt-0 md:ml-8 w-full md:w-auto">
            
            <Link
              to="/SignIn"
              className="bg-[#104DA3] hover:bg-[#334E73] text-white font-medium px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition text-center"
            >
              Log In / Sign Up
            </Link>
          </div>
        </div>
      
    </header>
  );
}
