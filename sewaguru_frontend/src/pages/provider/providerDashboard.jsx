import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { FaClipboardList, FaTools } from "react-icons/fa";
import { getToken } from "../../utils/auth";
import api from "../../api/api";

export default function ProviderDashboard() {
  const [firstName, setFirstName] = useState("Provider");
  const [userId, setUserId] = useState(null);
  const [counts, setCounts] = useState({
    totalRequests: 0,
    upcomingBookings: [], // This will specifically hold only PENDING requests
    completedJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        setFirstName(decoded.firstName || "Provider");
      } catch (error) {
        console.error("Failed to decode token:", error);
        setError("Failed to load user data. Please log in again.");
      }
    } else {
      setError("No authentication token found. Please log in.");
    }
  }, []);

  // Centralized function to fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setError("Authentication token missing. Please log in.");
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      // Fetch counts (this will include all statuses to give correct totals)
      const countsResponse = await api.get('/bookings/provider/summary', { headers });
      setCounts(prevCounts => ({
        ...prevCounts,
        totalRequests: countsResponse.data.totalRequests || 0,
        completedJobs: countsResponse.data.completedJobs || 0,
      }));

      // Fetch upcoming service requests (filter to only get 'pending' for this list)
      // It's crucial that your backend /bookings/provider/upcoming endpoint
      // either returns ALL and we filter here, or it can filter by status.
      // For simplicity, let's assume it returns all "upcoming" (not completed/cancelled yet)
      // and we filter here for 'pending' only for the dashboard view.
      const upcomingResponse = await api.get('/bookings/provider/upcoming', { headers });

      // *** IMPORTANT CHANGE HERE ***
      // Filter the fetched requests to only include 'pending' ones for this dashboard list
      const pendingRequests = upcomingResponse.data.filter(req => req.status === 'pending');

      setCounts(prevCounts => ({
        ...prevCounts,
        upcomingBookings: pendingRequests || [],
      }));

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch dashboard data. " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  // --- Functions to update booking status (integrated here) ---
  const updateBookingStatus = async (bookingId, newStatus) => {
    const token = getToken();
    if (!token) {
      setError("Authentication token missing for status update. Please log in.");
      return;
    }

    try {
      // Send the PATCH request to update the status
      const response = await api.patch(
        `/bookings/update/${bookingId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`Booking ${bookingId} status updated to ${newStatus}:`, response.data);

      // *** IMPORTANT CHANGE HERE FOR UI UPDATE ***
      // Instead of mapping and changing status, FILTER OUT the updated request
      // if its new status is no longer 'pending'.
      setCounts(prevCounts => ({
        ...prevCounts,
        upcomingBookings: prevCounts.upcomingBookings.filter(
          req => req._id !== bookingId
        )
      }));

      // Re-fetch the entire dashboard data to ensure counts (total, completed) are accurate
      // and that any new pending requests are shown if they arrived.
      fetchDashboardData();

    } catch (err) {
      console.error(`Error updating booking status to ${newStatus}:`, err);
      setError(err.response?.data?.message || `Failed to update status to ${newStatus}.`);
    }
  };

  const handleAcceptRequest = async (bookingId) => {
    await updateBookingStatus(bookingId, "accepted");
  };

  const handleDeclineRequest = async (bookingId) => {
    await updateBookingStatus(bookingId, "cancelled");
  };
  // --------------------------------------------------------

  if (loading) {
    return <div className="text-center py-10 text-gray-700 text-lg">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 text-lg">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
        Hello, {firstName} 👋
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DashboardCard
          icon={<FaClipboardList />}
          title="Total Requests"
          value={counts.totalRequests}
          color="bg-blue-100 border border-blue-200"
        />
        <DashboardCard
          icon={<FaTools />}
          title="Completed Jobs"
          value={counts.completedJobs}
          color="bg-purple-100 border border-purple-200"
        />
      </div>

      {/* Upcoming Requests Section */}
      <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-[#104DA3]">Upcoming Service Requests (Pending)</h2> {/* Clarified heading */}
          <a href="/provider/serviceRequests" className="text-sm text-blue-600 hover:underline font-medium">Manage All</a>
        </div>
        <ul className="space-y-4">
          {counts.upcomingBookings.length > 0 ? (
            counts.upcomingBookings.map((request) => (
              // Ensure we only render if status is pending, although the filter above should handle this.
              // This is a redundant check but adds safety.
              request.status === 'pending' && (
                <li
                  key={request._id}
                  className="p-5 bg-gray-50 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-gray-200"
                >
                  <div className="flex-grow">
                    <p className="font-semibold text-lg text-gray-800">{request.serviceType}{request.subService ? ` - ${request.subService}` : ''}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Date: {request.bookingDate ? new Date(request.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Customer: {request.customerName}</p>
                    <p className="text-sm text-gray-600">Contact: {request.customerContact}</p>
                    <p className="text-sm text-gray-600">Address: {request.customerAddress}</p>
                    {/* Status display will still show 'pending' here */}
                    <p className="text-sm text-gray-600">Status: <span className={`font-medium ${request.status === 'pending' ? 'text-yellow-600' : 'text-blue-600'}`}>{request.status}</span></p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-3 md:mt-0">
                    {/* Action buttons - only show for pending as per requirement */}
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition duration-200 shadow-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(request._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition duration-200 shadow-sm"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {/* Removed 'View Details' for accepted status from this list as only pending are shown */}
                  </div>
                </li>
              )
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No pending service requests at the moment.</p>
          )}
        </ul>
      </section>
    </div>
  );
}

// Reusable card component (no change)
function DashboardCard({ icon, title, value, color }) {
  return (
    <div className={`p-5 rounded-xl shadow-md ${color} flex items-center gap-5 transform hover:scale-105 transition-transform duration-300`}>
      <div className="text-4xl text-[#104DA3] opacity-80">{icon}</div>
      <div>
        <p className="text-base text-gray-700 font-medium">{title}</p>
        <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{value}</h3>
      </div>
    </div>
  );
}