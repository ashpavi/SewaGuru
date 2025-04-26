import { Link, Route, Routes } from "react-router-dom";
import { BiSolidMessageDetail } from "react-icons/bi";
import { GoHomeFill } from "react-icons/go";
import { BsPersonFill } from "react-icons/bs";
import { PiNotepadFill } from "react-icons/pi";
import { FaCalendarDays } from "react-icons/fa6";

import ProviderHeader from "../../components/providerHeader";
import ProviderDashboard from "./providerDashboard";
import ProviderMessages from "./providermessages";
import ServiceRequest from "./serviceRequest";
import ProviderBookings from "./providerBookings";
import ProviderProfile from "./providerProfile";

const sidebarLinks = [
  { to: "/provider/providerDashboard", icon: <GoHomeFill className="mr-2" />, label: "Dashboard" },
  { to: "/provider/providerMessages", icon: <BiSolidMessageDetail className="mr-2" />, label: "Messages" },
  { to: "/provider/serviceRequest", icon: <FaCalendarDays className="mr-2" />, label: "Service Requests" },
  { to: "/provider/providerBookings", icon: <PiNotepadFill className="mr-2" />, label: "Bookings" },
  { to: "/provider/providerProfile", icon: <BsPersonFill className="mr-2" />, label: "Profile" },
];

export default function ProviderHomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <ProviderHeader />

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
            <Route path="/providerDashboard" element={<ProviderDashboard />} />
            <Route path="/providerMessages" element={<ProviderMessages />} />
            <Route path="/serviceRequest" element={<ServiceRequest />} />
            <Route path="/providerBookings" element={<ProviderBookings />} />
            <Route path="/providerProfile" element={<ProviderProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
