import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import api from "../api/api";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();

  const loginWithGoogle = useGoogleLogin(
    {
      onSuccess: (res) => {
        setLoading(true);
        axios.post(import.meta.env.VITE_BACKEND_URL + "/user/google", {
          accessToken: res.access_token
        }).then((response) => {
          if (response.status === 200) {
            const { accessToken, refreshToken } = response.data;
            toast.success("Login successful!");

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            const decodedToken = jwtDecode(accessToken);
            const userrole = decodedToken.role;

            if (userrole === "admin") {
              navigate("/admin");
            } else if (userrole === "provider") {
              navigate("/provider/providerDashboard");
            } else {
              navigate("/home");
            }
            setLoading(false);
          } else {
            toast.error("Login failed: " + response.data.message);
          }
        }).catch((error) => {
          setLoading(false);
          toast.error("Login failed: " + error.message);
        });
      }
    }
  );

  const handleRegister = () => {
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address");
    return;
  }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
       api.post("/user/register", {
        firstName,
        lastName,
        email,
        phone,
        password
      }).then((res) => {
            toast.success("Registration successful!");
            navigate("/login");
          }).catch((err) => {
            console.error(err);
            toast.error(err.response?.data?.message || "Registration failed");
          }).finally(() => setLoading(false));
        }
      


  return (
    <div className="w-full min-h-screen bg-[url('/SignIn-bg4.jpg')] bg-cover bg-center flex items-center justify-center px-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl px-6 py-8 md:p-10 text-[#1F2937] flex flex-col items-center space-y-4 mt-4 mb-8 sm:my-10">
        
        {/* Logo */}
        <Link to="/home" className="mb-6">
          <img src={logo} alt="SewaGuru Logo" className="h-14 w-auto object-contain" />
        </Link>

        {/* First & Last Name */}
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            required
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full sm:w-1/2 px-5 py-3 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#104DA3] shadow-sm"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full sm:w-1/2 px-5 py-3 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#104DA3] shadow-sm"
          />
        </div>

         {/* Phone */}
         <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#104DA3] shadow-sm"
        />

        


        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#104DA3] shadow-sm"
        />
        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#104DA3] shadow-sm"
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-5 px-5 py-3 bg-white/10 border border-white/30 rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#104DA3] shadow-sm"
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

        {/* Google Login Button */}
        <button
          className="w-full flex items-center justify-center gap-3 bg-white text-[#1F2937] font-medium py-3 rounded-xl shadow-sm hover:bg-gray-100 transition"
          onClick={loginWithGoogle}
        >
          <FcGoogle className="text-xl" />
          <span>
            {loading ? "Loading..." : "Login with Google"}
          </span>
        </button>

        {/* Redirect */}
        <div className="w-full text-center text-sm text-[#1F2937] mt-6">
          Already have an account?{" "}
          <Link to="/logIn" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
