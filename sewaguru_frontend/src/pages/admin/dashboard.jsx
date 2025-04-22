import { FaUserTie, FaUsers, FaTasks } from "react-icons/fa";

export default function AdminDashboard() {
  const latestRequests = [
    { name: "Richard James", date: "24th July, 2024", id: 1 },
    { name: "Richard James", date: "24th July, 2024", id: 2 },
    { name: "Richard James", date: "24th July, 2024", id: 3 },
    { name: "Richard James", date: "24th July, 2024", id: 4 },
    { name: "Richard James", date: "24th July, 2024", id: 5 },
  ];

  return (
    <div className="h-full w-full">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Admin’s Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FaUserTie />} label="Registered Service Providers" value="15" />
        <StatCard icon={<FaUsers />} label="Registered Customers" value="22" />
        <StatCard icon={<FaTasks />} label="Total Projects" value="10" />
      </div>

      {/* Latest Requests */}
      <div>
        <h3 className="text-md font-semibold mb-3 text-blue-800">📋 Latest Requests</h3>
        <ul className="space-y-3">
          {latestRequests.map(req => (
            <li key={req.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <img src="https://i.pravatar.cc/40?img=3" alt="User" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium text-gray-700">{req.name}</p>
                  <p className="text-xs text-gray-500">Booking on {req.date}</p>
                </div>
              </div>
              <button className="text-red-500 font-bold text-xl">×</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl shadow-sm">
      <div className="text-3xl text-blue-600">{icon}</div>
      <div>
        <p className="text-lg font-bold">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
