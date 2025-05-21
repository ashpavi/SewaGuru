import { useEffect, useState } from 'react';
import api from "../../api/api";
import { getToken } from '../../utils/auth';
import Loader from "../../components/loader";
import toast from 'react-hot-toast';

export default function UserBookings() {
    const [activeBookings, setActiveBookings] = useState([]);
    const [activeSubscriptions, setActiveSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null); // Store userId in state

    useEffect(() => {
        const token = getToken();
        const fetchUserDataAndServices = async () => {
            setLoading(true);
            setError('');
            try {
                if (!token) {
                    setError("Authentication required. Please log in.");
                    setLoading(false);
                    return;
                }

                const userResponse = await api.get("/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = userResponse.data;
                setUserId(userData.id); // Set userId in state

                const bookingsResponse = await api.get(`/bookings/user/${userData.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setActiveBookings(bookingsResponse.data);

                const subscriptionsResponse = await api.get(`/subscriptions/user/${userData.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Filter subscriptions to only show "active" ones for display
                setActiveSubscriptions(subscriptionsResponse.data.filter(sub =>
                    sub.status === 'active' || sub.paymentStatus === 'active' || sub.status === 'pending'
                )); // Added pending as well, as it might be cancelable

            } catch (err) {
                console.error("Error fetching user data and services:", err);
                const errorMessage = err.response?.data?.message || "Failed to fetch bookings and subscriptions.";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDataAndServices();
    }, []); // Removed userId from dependency array as it's set once from initial fetch

    const handleCancelBooking = async (bookingId) => {
        const token = getToken();
        if (window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
            setLoading(true);
            try {
                await api.delete(`/bookings/${bookingId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("Booking cancelled successfully.");
                // Re-fetch bookings specifically after cancellation
                if (userId) { // Ensure userId is available before refetching
                    const bookingsResponse = await api.get(`/bookings/user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setActiveBookings(bookingsResponse.data);
                }
            } catch (err) {
                console.error("Error cancelling booking:", err);
                const errorMessage = err.response?.data?.msg || err.response?.data?.message || "Failed to cancel booking.";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCancelSubscription = async (subscriptionId) => {
        const token = getToken();
        if (window.confirm("Are you sure you want to cancel this subscription? This action cannot be undone.")) {
            setLoading(true);
            try {
                await api.delete(`/subscriptions/${subscriptionId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("Subscription cancelled successfully.");
                // Re-fetch subscriptions specifically after cancellation
                if (userId) { // Ensure userId is available before refetching
                    const subscriptionsResponse = await api.get(`/subscriptions/user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setActiveSubscriptions(subscriptionsResponse.data.filter(sub =>
                        sub.status === 'active' || sub.paymentStatus === 'active' || sub.status === 'pending'
                    )); // Re-apply the filter after fetching
                }
            } catch (err) {
                console.error("Error cancelling subscription:", err);
                const errorMessage = err.response?.data?.message || "Failed to cancel subscription.";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const getBookingStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getSubscriptionStatusBadgeClass = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'expired': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error && activeBookings.length === 0 && activeSubscriptions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
                <div className="text-red-700 bg-red-100 border border-red-400 p-6 rounded-lg shadow-md text-center max-w-md mx-auto">
                    <h2 className="text-xl font-semibold mb-3">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Active Services</h2>

            {/* Active Bookings Section */}
            <div className="mb-10">
                <h3 className="text-2xl font-semibold text-gray-800 mb-5 border-b-2 pb-2">Active Bookings</h3>
                {activeBookings.length > 0 ? (
                    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {activeBookings.map(booking => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {booking.serviceType || 'N/A'} {booking.subService ? ` - ${booking.subService}` : ''}
                                        </td><td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                            {booking.providerName || 'N/A'}
                                        </td><td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                            {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Invalid Date'}
                                        </td><td className="py-4 px-4 whitespace-nowrap text-center">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBookingStatusBadgeClass(booking.status)}`}>
                                                {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'N/A'}
                                            </span>
                                        </td><td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                                            {(booking.status === 'pending' || booking.status === 'accepted') && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking._id)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            {!(booking.status === 'pending' || booking.status === 'accepted') && (
                                                <span className="text-gray-500 text-xs italic">
                                                    Action not available
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-600 py-8 bg-white rounded-lg shadow-md">
                        <p className="text-lg">You have no active bookings at the moment.</p>
                        <p className="mt-2 text-md">Looking for a service? Explore our options!</p>
                    </div>
                )}
            </div>

            {/* Active Subscriptions Section */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-5 border-b-2 pb-2">Active Subscriptions</h3>
                {activeSubscriptions.length > 0 ? (
                    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Billing</th>
                                    <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {activeSubscriptions.map(subscription => (
                                    <tr key={subscription._id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{subscription.planType || 'N/A'}</td><td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                            {subscription.startDate ? new Date(subscription.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Invalid Date'}
                                        </td><td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                            {/* Changed to subscription.endDate as per your previous database structure */}
                                            {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                        </td><td className="py-4 px-4 whitespace-nowrap text-center">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getSubscriptionStatusBadgeClass(subscription.paymentStatus)}`}>
                                                {/* Displaying paymentStatus for the badge, consistent with your original code */}
                                                {subscription.paymentStatus ? subscription.paymentStatus.charAt(0).toUpperCase() + subscription.paymentStatus.slice(1) : 'N/A'}
                                            </span>
                                        </td><td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                                            {/* Updated condition to check for 'active' paymentStatus or 'pending' status */}
                                            {(subscription.paymentStatus === 'active' || subscription.status === 'pending') && (
                                                <button
                                                    onClick={() => handleCancelSubscription(subscription._id)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            {!(subscription.paymentStatus === 'active' || subscription.status === 'pending') && (
                                                <span className="text-gray-500 text-xs italic">
                                                    Action not available
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-600 py-8 bg-white rounded-lg shadow-md">
                        <p className="text-lg">You have no active subscriptions at the moment.</p>
                        <p className="mt-2 text-md">Consider subscribing for recurring services!</p>
                    </div>
                )}
            </div>

            {activeBookings.length === 0 && activeSubscriptions.length === 0 && !loading && !error && (
                <div className="text-center text-gray-600 py-10">
                    <p className="text-xl font-medium">No active services found.</p>
                    <p className="mt-3 text-md">Book a new service or subscribe to a plan to see them here.</p>
                </div>
            )}
        </div>
    );
}