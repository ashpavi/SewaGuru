import { Link, Routes, Route, useLocation, Navigate  } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { BiSolidMessageDetail } from "react-icons/bi";
import { PiNotepadFill } from "react-icons/pi";
import { FaCalendarDays } from "react-icons/fa6";
import { BsPersonFill } from "react-icons/bs";

import ProviderHeader from "../components/providerHeader";
import ProviderDashboard from "./provider/providerDashboard";
import ProviderMessages from "./provider/providermessages";
import ServiceRequest from "./provider/serviceRequest";
import ProviderBookings from "./provider/providerBookings";
import ProviderProfile from "./provider/providerProfile";
import ProviderEditProfile from "./provider/providerEditProfile";

const links = [
  { to: "/provider/providerDashboard", label: "Dashboard", icon: <GoHomeFill className="mr-2" /> },
  { to: "/provider/providerMessages", label: "Messages", icon: <BiSolidMessageDetail className="mr-2" /> },
  { to: "/provider/serviceRequests", label: "Service Requests", icon: <FaCalendarDays className="mr-2" /> },
  { to: "/provider/providerBookings", label: "Bookings", icon: <PiNotepadFill className="mr-2" /> },
  { to: "/provider/providerProfile", label: "Profile", icon: <BsPersonFill className="mr-2" /> },
];

export default function ProviderHomePage() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ProviderHeader />

      {/* Mobile Navigation Pills */}
      <nav className="md:hidden bg-white px-2 py-3 shadow-sm flex gap-2 overflow-x-auto whitespace-nowrap">
        {links.map((link, i) => (
          <Link
            key={i}
            to={link.to}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition ${
              location.pathname === link.to
                ? "bg-[#48B8E3] text-white"
                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Desktop Sidebar */}
      <div className="flex flex-1 w-full">
        <aside className="hidden md:flex md:w-64 bg-white shadow-md p-4 flex-col space-y-2">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                location.pathname === link.to
                  ? "bg-blue-100 font-semibold"
                  : "hover:bg-gray-200"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Routes>
            <Route index element={<Navigate to="/provider/providerDashboard" />} />
            <Route path="providerDashboard" element={<ProviderDashboard />} />
            <Route path="providerMessages" element={<ProviderMessages />} />
            <Route path="serviceRequests" element={<ServiceRequest />} />
            <Route path="providerBookings" element={<ProviderBookings />} />
            <Route path="providerProfile" element={<ProviderProfile />} />
            <Route path="providerEditProfile" element={<ProviderEditProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
