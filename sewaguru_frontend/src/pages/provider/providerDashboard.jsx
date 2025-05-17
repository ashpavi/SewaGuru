import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { FaCalendarCheck, FaClipboardList, FaComments, FaTools } from "react-icons/fa";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { getToken } from "../../utils/auth";

export default function ProviderDashboard() {
  const [firstName, setFirstName] = useState("Provider");

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setFirstName(decoded.firstName || "Provider");
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
        Hello, {firstName} 👋
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard icon={<FaClipboardList />} title="Total Requests" value="42" color="bg-blue-100" />
        <DashboardCard icon={<FaCalendarCheck />} title="Upcoming Bookings" value="5" color="bg-green-100" />
        <DashboardCard icon={<FaComments />} title="Messages" value="12" color="bg-yellow-100" />
        <DashboardCard icon={<FaTools />} title="Completed Jobs" value="19" color="bg-purple-100" />
      </div>

      {/* Upcoming Requests Section */}
      <section className="bg-white p-5 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#104DA3]">Upcoming Service Requests</h2>
          <a href="/provider/serviceRequests" className="text-sm text-blue-600 hover:underline">Manage All</a>
        </div>
        <ul className="space-y-3">
          {/* Sample Request Item */}
          {[
            { id: 1, service: "AC Repair", time: "May 1, 2:00 PM" },
            { id: 2, service: "Plumbing", time: "May 2, 11:00 AM" },
          ].map((request) => (
            <li key={request.id} className="p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <p className="font-medium text-gray-800">{request.service}</p>
                <p className="text-sm text-gray-500">{request.time}</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">Accept</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600">Decline</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Notifications */}
      <section className="bg-white p-5 rounded-xl shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <MdOutlineNotificationsActive className="text-xl text-red-500" />
          <h2 className="text-lg font-semibold text-gray-800">Latest Notifications</h2>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">⚠️ Don’t forget to update your work schedule.</p>
          <p className="text-sm text-gray-600">📢 A new service request was submitted by a client.</p>
        </div>
      </section>
    </div>
  );
}

// Reusable card component
function DashboardCard({ icon, title, value, color }) {
  return (
    <div className={`p-4 rounded-xl shadow-md ${color} flex items-center gap-4`}>
      <div className="text-3xl text-[#104DA3]">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}
