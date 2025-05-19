import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
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
                setError("Authentication required.");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/bookings/provider", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRequests(response.data);
            } catch (err) {
                console.error("Error fetching service requests:", err);
                setError(err.response?.data?.message || "Failed to fetch service requests.");
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
        await updateBookingStatus(bookingId, "cancelled"); // Using 'cancelled' as per your model
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
            // Update the local state to reflect the change
            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req._id === bookingId ? { ...req, status: newStatus } : req
                )
            );
        } catch (err) {
            console.error(`Error updating booking status to ${newStatus}:`, err);
            // Optionally display an error message to the user
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Service Requests</h1>

            {requests.length === 0 ? (
                <p className="text-gray-600">No new service requests at the moment.</p>
            ) : (
                <div className="grid gap-6">
                    {requests.map((req) => (
                        <div
                            key={req._id}
                            className="bg-white rounded-xl shadow-md p-5 space-y-4 border-l-4 border-blue-400"
                        >
                            <div className="flex justify-between items-start flex-wrap">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-[#104DA3]">
                                        {req.serviceType}
                                        {req.subService && ` - ${req.subService}`}
                                    </h2>
                                    <p className="text-gray-700">Customer: {req.customerId?.firstName} {req.customerId?.lastName}</p>
                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                        <FaCalendarAlt /> {new Date(req.bookingDate).toLocaleDateString()}
                                        <FaClock className="ml-4" /> {req.bookingTime} {/* Assuming time is part of bookingDate */}
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                        <FaMapMarkerAlt /> {req.location}
                                    </div>
                                    {req.urgency && <p className="text-sm text-orange-500">Urgency: {req.urgency}</p>}
                                    {req.complexity && <p className="text-sm text-indigo-500">Complexity: {req.complexity}</p>}
                                </div>

                                <div className="mt-4 md:mt-0 flex gap-2">
                                    {req.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleAccept(req._id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleDecline(req._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}
                                    <span className="text-gray-600 font-semibold capitalize">{req.status}</span>
                                </div>
                            </div>

                            {req.description && (
                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                    <span className="font-medium text-gray-700">Description: </span>
                                    {req.description}
                                </div>
                            )}
                            {req.addressDetails && (
                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                    <span className="font-medium text-gray-700">Address Details: </span>
                                    {req.addressDetails}
                                </div>
                            )}
                            {req.estimatedAmount && (
                                <p className="text-sm text-blue-700">Estimated Amount: {req.estimatedAmount}</p>
                            )}
                            {req.paymentMethod && (
                                <p className="text-sm text-green-700">Payment Method: {req.paymentMethod}</p>
                            )}
                            {req.imagesUploaded && req.imagesUploaded.length > 0 && (
                                <div className="mt-2">
                                    <span className="font-medium text-gray-700">Uploaded Images:</span>
                                    <div className="flex gap-2 mt-1">
                                        {req.imagesUploaded.map((imgSrc, index) => (
                                            <img key={index} src={imgSrc} alt={`Uploaded ${index + 1}`} className="w-20 h-20 object-cover rounded-md" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}