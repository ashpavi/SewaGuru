import { Link, Route, Routes } from "react-router-dom";
import { BiSolidMessageDetail } from "react-icons/bi";
import { GoHomeFill } from "react-icons/go";
import { BsPersonFill } from "react-icons/bs";
import { PiNotepadFill } from "react-icons/pi";
import { FaCalendarDays } from "react-icons/fa6";

import SGHeader from "../../components/sgHeader";
import SGDashboard from "./sgDashboard";
import SGMessages from "./sgMessages";
import ServiceRequest from "./serviceRequest";
import SGBookings from "./sgBookings";
import SGProfile from "./sgProfile";

const sidebarLinks = [
  { to: "/sewaguru/sgDashboard", icon: <GoHomeFill className="mr-2" />, label: "Dashboard" },
  { to: "/sewaguru/sgMessages", icon: <BiSolidMessageDetail className="mr-2" />, label: "Messages" },
  { to: "/sewaguru/serviceRequest", icon: <FaCalendarDays className="mr-2" />, label: "Service Requests" },
  { to: "/sewaguru/sgBookings", icon: <PiNotepadFill className="mr-2" />, label: "Bookings" },
  { to: "/sewaguru/sgProfile", icon: <BsPersonFill className="mr-2" />, label: "Profile" },
];

export default function SGHomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SGHeader />

      <div className="flex flex-1 bg-gray-200 p-2.5">
        {/* Sidebar */}
        <div className="h-full w-[260px] space-y-2">
          {sidebarLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="w-full h-[50px] bg-white rounded-xl flex items-center justify-center hover:bg-gray-300 transition"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg p-4 overflow-y-auto">
          <Routes>
            <Route path="/sgDashboard" element={<SGDashboard />} />
            <Route path="/sgMessages" element={<SGMessages />} />
            <Route path="/serviceRequest" element={<ServiceRequest />} />
            <Route path="/sgBookings" element={<SGBookings />} />
            <Route path="/sgProfile" element={<SGProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
