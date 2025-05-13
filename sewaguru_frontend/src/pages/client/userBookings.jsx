import { useEffect, useState } from 'react';
import api from "../../api/api"; // Assuming your API instance
import { token } from '../../utils/auth';

export default function UserBookings() {
    const [activeBookings, setActiveBookings] = useState([]);
    const [activeSubscriptions, setActiveSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [customerId, setCustomerId] = useState(null);

    useEffect(() => {
        const fetchUserDataAndServices = async () => {
            setLoading(true);
            setError('');
            try {
                console.log("Token from localStorage:", token);

                if (!token) {
                    setError("Authentication required.");
                    setLoading(false);
                    return;
                }

                // Fetch user data to get the ID
                console.log("Fetching user data from /user endpoint...");
                const userResponse = await api.get("/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = userResponse.data;
                console.log("User data received:", userData);
                setCustomerId(userData.id);

                // Fetch bookings using the userId from userData
                console.log(`Fetching bookings for user ID: ${userData.id} from /bookings/user/${userData.id}...`);
                const bookingsResponse = await api.get(`/bookings/user/${userData.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Bookings data received:", bookingsResponse.data);
                setActiveBookings(bookingsResponse.data);

                // Fetch subscriptions using the userId from userData
                console.log(`Fetching subscriptions for user ID: ${userData.id} from /subscriptions/user/${userData.id}...`);
                const subscriptionsResponse = await api.get(`/subscriptions/user/${userData.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Subscriptions data received:", subscriptionsResponse.data);
                setActiveSubscriptions(subscriptionsResponse.data);

                console.log("CustomerId set:", customerId); // Log after potential update

            } catch (err) {
                console.error("Error fetching user data and services:", err);
                setError(err.response?.data?.message || "Failed to fetch bookings and subscriptions.");
                console.log("Error details:", err);
            } finally {
                setLoading(false);
                console.log("Loading state:", loading);
            }
        };

        fetchUserDataAndServices();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        console.log("Attempting to cancel booking with ID:", bookingId);
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await api.delete(`/bookings/${bookingId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Booking cancelled successfully on backend.");
                // After successful deletion, re-fetch bookings
                const userResponse = await api.get("/user", { // Re-fetch user data to ensure latest ID
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = userResponse.data;
                const bookingsResponse = await api.get(`/users/${userData.id}/bookings`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setActiveBookings(bookingsResponse.data);
                alert("Booking cancelled successfully.");
            } catch (err) {
                console.error("Error cancelling booking:", err);
                setError(err.response?.data?.message || "Failed to cancel booking.");
                console.log("Cancel booking error details:", err);
            }
        }
    };

    const handleCancelSubscription = async (subscriptionId) => {
        console.log("Attempting to cancel subscription with ID:", subscriptionId);
        if (window.confirm("Are you sure you want to cancel this subscription?")) {
            try {
                await api.delete(`/subscriptions/${subscriptionId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Subscription cancelled successfully on backend.");
                // After successful deletion, re-fetch subscriptions
                const userResponse = await api.get("/user", { // Re-fetch user data to ensure latest ID
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = userResponse.data;
                const subscriptionsResponse = await api.get(`/users/${userData.id}/subscriptions`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setActiveSubscriptions(subscriptionsResponse.data);
                alert("Subscription cancelled successfully.");
            } catch (err) {
                console.error("Error cancelling subscription:", err);
                setError(err.response?.data?.message || "Failed to cancel subscription.");
                console.log("Cancel subscription error details:", err);
            }
        }
    };

    if (loading) {
        return <div className="text-center text-gray-600">Loading bookings and subscriptions...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-semibold text-[#104DA3] mb-6 text-center">Your Active Services</h2>

            {activeBookings.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Active Bookings</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeBookings.map(booking => (
                                    <tr key={booking._id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6 whitespace-nowrap">{booking.serviceType || 'N/A'}</td>
                                        <td className="py-4 px-6 whitespace-nowrap">{new Date(booking.date).toLocaleDateString()}</td>
                                        <td className="py-4 px-6 whitespace-nowrap">{booking.time || 'N/A'}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-200 text-green-700' : booking.status === 'pending' ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-200 text-gray-700'}`}>{booking.status}</span>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleCancelBooking(booking._id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus-shadow-outline"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeSubscriptions.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Active Subscriptions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Billing</th>
                                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeSubscriptions.map(subscription => (
                                    <tr key={subscription._id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6 whitespace-nowrap">{subscription.planType}</td>
                                        <td className="py-4 px-6 whitespace-nowrap">{new Date(subscription.startDate).toLocaleDateString()}</td>
                                        <td className="py-4 px-6 whitespace-nowrap">{new Date(subscription.nextBillingDate).toLocaleDateString()}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${subscription.paymentStatus === 'paid' ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'}`}>{subscription.paymentStatus}</span>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleCancelSubscription(subscription._id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus-shadow-outline"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeBookings.length === 0 && activeSubscriptions.length === 0 && !loading && !error && (
                <div className="text-center text-gray-600">
                    <p>No active bookings or subscriptions found.</p>
                </div>
            )}
        </div>
    );
}