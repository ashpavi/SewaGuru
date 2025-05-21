import { Link } from "react-router-dom";
import { FaEnvelope, FaGlobe, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../assets/footer_logo.png"; 

export default function Footer() {
  return (
    <footer className="bg-[#1f2937] text-white text-sm w-full">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-8 md:gap-6">

        {/* Left Section - Logo & About */}
        <div className="flex-1 flex flex-col gap-4 pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-white/20">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SewaGuru Logo" className="h-14 w-auto" />
          </div>
          <p className="text-gray-400 max-w-sm leading-relaxed">
            SewaGuru is your trusted home service marketplace, connecting you with skilled professionals for all your household needs.
          </p>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="flex-1 px-0 md:px-6 border-b md:border-b-0 md:border-r border-white/20">
          <h3 className="font-semibold mb-3">QUICK LINKS</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/home" className="hover:text-white">HOME PAGE</Link></li>
            <li><Link to="/ourServices" className="hover:text-white">OUR SERVICES</Link></li>
            <li><Link to="/privacyPolicy" className="hover:text-white">PRIVACY POLICY</Link></li>
            <li><Link to="/aboutUs" className="hover:text-white">ABOUT US</Link></li>
            <li><Link to="/contactUs" className="hover:text-white">CONTACT US</Link></li>
          </ul>
        </div>

        {/* Right Section - Contact Info */}
        <div className="flex-1 pl-0 md:pl-6">
          <h3 className="font-semibold mb-3">CONTACT</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2"><FaEnvelope /> sewaguru@gmail.com</li>
            <li className="flex items-center gap-2"><FaGlobe /> www.sewaguru.online.lk</li>
            <li className="flex items-center gap-2"><FaPhoneAlt /> +94 77 002 1234</li>
            <li className="flex items-center gap-2"><FaMapMarkerAlt /> No. 123, Main Street, Colombo, Sri Lanka</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-white/20 my-4" />

      {/* Bottom Bar */}
      <div className="text-center text-gray-400 pb-4 text-xs">
        © {new Date().getFullYear()} SewaGuru – All Rights Reserved.
      </div>
    </footer>
  );
}
