import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTag, FaInfoCircle, FaImage, FaUserAlt, FaMoneyBillWave } from "react-icons/fa"; // Added more icons
import api from "../../api/api"; // Adjust path as needed
import { getToken } from "../../utils/auth"; // Adjust path as needed
import Loader from "../../components/loader"; // Assuming you have a Loader component

export default function ServiceRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchServiceRequests = async () => {
            setLoading(true);
            setError("");
            const token = getToken();

            if (!token) {
                setError("Authentication required. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/bookings/provider", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Sort requests: pending first, then accepted, then others, by creation date
                const sortedRequests = response.data.sort((a, b) => {
                    const statusOrder = { 'pending': 1, 'accepted': 2, 'completed': 3, 'cancelled': 4 };
                    // Primary sort by status order
                    if (statusOrder[a.status] !== statusOrder[b.status]) {
                        return statusOrder[a.status] - statusOrder[b.status];
                    }
                    // Secondary sort by creation date (newest first) for same status
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setRequests(sortedRequests);
            } catch (err) {
                console.error("Error fetching service requests:", err);
                setError(err.response?.data?.message || "Failed to fetch service requests. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchServiceRequests();
    }, []);

    const handleAccept = async (bookingId) => {
        await updateBookingStatus(bookingId, "accepted");
    };

    const handleDecline = async (bookingId) => {
        await updateBookingStatus(bookingId, "cancelled");
    };

    const handleComplete = async (bookingId) => {
        await updateBookingStatus(bookingId, "completed");
    };

    const updateBookingStatus = async (bookingId, newStatus) => {
        const token = getToken();
        try {
            const response = await api.patch(
                `/bookings/update/${bookingId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Booking status updated:", response.data);
            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req._id === bookingId ? { ...req, status: newStatus } : req
                ).sort((a, b) => { // Re-sort after status update to reflect new status position
                    const statusOrder = { 'pending': 1, 'accepted': 2, 'completed': 3, 'cancelled': 4 };
                    if (statusOrder[a.status] !== statusOrder[b.status]) {
                        return statusOrder[a.status] - statusOrder[b.status];
                    }
                    return new Date(b.createdAt) - new Date(a.createdAt);
                })
            );
        } catch (err) {
            console.error(`Error updating booking status to ${newStatus}:`, err);
            setError(err.response?.data?.message || `Failed to update status to ${newStatus}.`);
        }
    };

    // Helper function to format date and time
    const formatDateTime = (isoDate, time) => {
        const date = new Date(isoDate);
        return {
            date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            time: time || date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        };
    };

    // Helper function to get status badge colors
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'accepted': return 'bg-green-100 text-green-800 border-green-300';
            case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
                <div className="text-red-700 bg-red-100 border border-red-400 p-6 rounded-lg shadow-md text-center max-w-md mx-auto">
                    <h2 className="text-xl font-semibold mb-3">Error Loading Requests</h2>
                    <p>{error}</p>
                    <p className="mt-4 text-sm text-gray-600">Please try refreshing the page or contact support.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Service Requests</h1>

            {requests.length === 0 ? (
                <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                    <p className="text-gray-600 text-xl text-center py-10 px-6 bg-white rounded-lg shadow-md">
                        <span className="block text-5xl mb-4" role="img" aria-label="Clipboard">📋</span>
                        No service requests at the moment.<br/>You're all caught up!
                    </p>
                </div>
            ) : (
                <div className="space-y-6 max-w-6xl mx-auto"> {/* Changed from grid to space-y for vertical stacking */}
                    {requests.map((req) => {
                        const { date, time } = formatDateTime(req.bookingDate, req.bookingTime);
                        const statusClass = getStatusBadgeClass(req.status);

                        return (
                            <div
                                key={req._id}
                                className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-blue-600 hover:shadow-xl transition-all duration-300 ease-in-out"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                    {/* Service & Customer Info */}
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                                            {req.serviceType}
                                            {req.subService && <span className="text-gray-500 text-lg ml-2"> - {req.subService}</span>}
                                        </h2>
                                        <p className="text-md text-gray-700 font-medium flex items-center mt-1">
                                            <FaUserAlt className="text-gray-500 mr-2" /> Customer: <span className="font-semibold ml-1">{req.customerId?.firstName} {req.customerId?.lastName}</span>
                                        </p>
                                        <span className={`mt-2 px-3 py-1 rounded-full text-sm font-bold inline-block border ${statusClass}`}>
                                            Status: {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]"> {/* Fixed width for button container */}
                                        {req.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAccept(req._id)}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                                                >
                                                    Accept Request
                                                </button>
                                                <button
                                                    onClick={() => handleDecline(req._id)}
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                                                >
                                                    Decline
                                                </button>
                                            </>
                                        )}

                                        {req.status === 'accepted' && (
                                            <button
                                                onClick={() => handleComplete(req._id)}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                Mark as Completed
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <hr className="border-gray-200 mb-4" /> {/* Separator */}

                                {/* Request Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 text-base">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="text-blue-500 mr-3 min-w-[20px]" /> <span className="font-medium">Date:</span> {date}
                                    </div>
                                    
                                    <div className="flex items-start col-span-1 md:col-span-2">
                                        <FaMapMarkerAlt className="text-blue-500 mr-3 mt-1 min-w-[20px]" /> <span className="font-medium">Location:</span> {req.location}
                                    </div>
                                    {req.addressDetails && (
                                        <div className="flex items-start col-span-1 md:col-span-2">
                                            <FaInfoCircle className="text-blue-500 mr-3 mt-1 min-w-[20px]" /> <span className="font-medium">Address Details:</span> <span className="line-clamp-2">{req.addressDetails}</span>
                                        </div>
                                    )}
                                    {req.description && (
                                        <div className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-md text-sm border border-gray-100 mt-2">
                                            <span className="font-semibold text-gray-800 flex items-center mb-1"><FaInfoCircle className="mr-2" />Description: </span>
                                            <p>{req.description}</p>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <FaTag className="text-orange-500 mr-3" /> <span className="font-medium">Urgency:</span> <span className="font-semibold">{req.urgency}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaTag className="text-indigo-500 mr-3" /> <span className="font-medium">Complexity:</span> <span className="font-semibold">{req.complexity}</span>
                                    </div>
                                    {req.estimatedAmount && (
                                        <div className="flex items-center text-blue-700 font-bold text-lg col-span-1 md:col-span-2">
                                            <FaMoneyBillWave className="mr-3 text-blue-600" /> Estimated Amount: LKR {req.estimatedAmount.toFixed(2)}
                                        </div>
                                    )}
                                    {req.paymentMethod && (
                                        <div className="flex items-center text-green-700 font-semibold text-base col-span-1 md:col-span-2">
                                            <FaMoneyBillWave className="mr-3 text-green-600" /> Payment Method: {req.paymentMethod}
                                        </div>
                                    )}
                                </div>

                                {/* Uploaded Images Section */}
                                {req.imagesUploaded && req.imagesUploaded.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                        <span className="font-semibold text-gray-700 flex items-center mb-3"><FaImage className="mr-2 text-gray-600" />Uploaded Images:</span>
                                        <div className="flex flex-wrap gap-3">
                                            {req.imagesUploaded.map((imgSrc, index) => (
                                                <img
                                                    key={index}
                                                    src={imgSrc}
                                                    alt={`Uploaded ${index + 1}`}
                                                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md border-2 border-gray-200 shadow-sm cursor-pointer hover:border-blue-500 transition-colors duration-200"
                                                    onClick={() => window.open(imgSrc, '_blank')}
                                                    title="Click to view full image"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}