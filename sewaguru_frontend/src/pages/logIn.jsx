import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import api from "../api/api";
import toast from "react-hot-toast";
import { useState } from "react";
import {jwtDecode} from "jwt-decode";



export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const handleLogin = async(email,password) => {
    try{
      const response = await api.post("/user/login", {

        email: email,
        password: password
      });
      if (response.status === 200) {

        const { accessToken, refreshToken } = response.data;
        toast.success("Login successful!");
        

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        const decodedToken = jwtDecode(accessToken);
        const userrole = decodedToken.role;

        


        if (userrole === "admin") {
          window.location.href = "/admin"; 
        } else if (userrole === "provider") {
          window.location.href = "/providerHomepage";
        } else {
          window.location.href = "/";
        }
      } else {
        toast.error("Login failed: " + response.data.message);
      }
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
  }

  return (
    <div className="w-full h-screen bg-[url('/SignIn-bg4.jpg')] bg-cover bg-center flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-10 text-[#1F2937] flex flex-col items-center">

        {/* Logo */}
        <Link to="/" className="mb-6">
          <img
            src={logo}
            alt="SewaGuru Logo"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-4 px-5 py-3 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#104DA3] shadow-sm"
        />

        {/* Password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-5 py-3 mb-2 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#104DA3] shadow-sm"
        />


        {/* Login Button */}
        <button onClick={() => handleLogin(email, password)} className="w-full bg-gradient-to-r from-[#48B8E3] to-[#2498d2] hover:from-[#3baede] hover:to-[#1f88c3] transition text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg mb-4">
          Login
        </button>


                {/* Divider */}
        <div className="w-full flex items-center my-4">
          <div className="flex-grow h-px bg-white/30"></div>
          <span className="px-3 text-sm text-white/70">OR</span>
          <div className="flex-grow h-px bg-white/30"></div>
        </div>

        {/* Google Login Button */}
        <button
          className="w-full flex items-center justify-center gap-3 bg-white text-[#1F2937] font-medium py-3 rounded-xl shadow-sm hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button>



        {/* Register Prompt */}
        <div className="w-full text-center text-sm text-[#1F2937] mt-6">
          Don’t have an account?{' '}
          <Link to="/signUp" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}
