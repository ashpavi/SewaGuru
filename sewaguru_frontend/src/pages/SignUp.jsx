import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is 'user'
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/", {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
    }).then((res) => {
      toast.success("Registration successful!");
      navigate("/login");
    }).catch((err) => {
      toast.error(err.response?.data?.message || "Registration failed");
    }).finally(() => setLoading(false));
  };

  return (
    <div className="w-full min-h-screen bg-[url('/SignIn-bg4.jpg')] bg-cover bg-center flex items-center justify-center px-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl px-6 py-8 md:p-10 text-[#1F2937] flex flex-col items-center space-y-4 mt-4 mb-8 sm:my-10">
        
        {/* Logo */}
        <Link to="/" className="mb-6">
          <img src={logo} alt="SewaGuru Logo" className="h-14 w-auto object-contain" />
        </Link>

        {/* First & Last Name */}
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full sm:w-1/2 px-5 py-3 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full sm:w-1/2 px-5 py-3 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm"
          />
        </div>

        


        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm"
        />
        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm"
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-5 px-5 py-3 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm"
        />

        {/* Phone */}
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm"
        />

        

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#48B8E3] to-[#2498d2] hover:from-[#3baede] hover:to-[#1f88c3] transition text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg mb-1"
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>

        {/* Divider */}
        <div className="w-full flex items-center my-4">
          <div className="flex-grow h-px bg-white/30"></div>
          <span className="px-3 text-sm text-white/70">OR</span>
          <div className="flex-grow h-px bg-white/30"></div>
        </div>

        {/* Google Signup */}
        <button
          className="w-full flex items-center justify-center gap-3 bg-white text-[#1F2937] font-medium py-3 rounded-xl shadow-sm hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-lg sm:text-xl" />
          <span>Continue with Google</span>
        </button>

        {/* Redirect */}
        <div className="w-full text-center text-sm text-[#1F2937] mt-6">
          Already have an account?{" "}
          <Link to="/signIn" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
