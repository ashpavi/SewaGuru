import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { getToken } from '../../utils/auth';
import Loader from '../../components/loader';

// Renamed component for clarity since it will now fetch all subscriptions
const AdminAllSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]); // Renamed from activeSubscriptions for clarity
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper for consistent date formatting
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return 'Invalid Date';
        }
    };

    // Function to fetch subscriptions, wrapped in useCallback
    const fetchSubscriptions = useCallback(async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const token = getToken();
            if (!token) {
                setError('No authentication token found. Please log in as admin.');
                setLoading(false);
                toast.error('Authentication required. Please log in as admin.'); // Toast for immediate feedback
                return;
            }

            // Using the existing '/subscriptions/admin/active' route
            // If you changed the backend route to '/subscriptions/admin/all', update this line
            const response = await api.get('/subscriptions/admin/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSubscriptions(response.data); // Update state with all fetched subscriptions
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch subscriptions.';
            setError(errorMessage);
            toast.error(errorMessage); // Display the actual error message in the toast
        } finally {
            setLoading(false); // Ensure loading is always set to false
        }
    }, []); // Empty dependency array for useCallback means this function is created once

    useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]); // Dependency on fetchSubscriptions to re-run if it changes

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="container mx-auto p-8 text-center">
                <div className="text-red-500 text-xl mb-4">Error: {error}</div>
                <p className="text-gray-600">Please try again later or ensure you are logged in as an administrator.</p>
                <button
                    onClick={fetchSubscriptions} // Retry button to re-fetch
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                All Subscriptions
            </h2>
            {subscriptions.length > 0 ? (
                <ul className="space-y-4">
                    {subscriptions.map((sub) => (
                        <li key={sub._id} className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {/* Prefer user's first/last name if populated, else customerName */}
                                {sub.user?.firstName && sub.user?.lastName
                                    ? `${sub.user.firstName} ${sub.user.lastName}`
                                    : sub.customerName}
                                {sub.user && ` (User ID: ${sub.user._id})`} {/* Show user ID if available */}
                            </h3>
                            {sub.user?.email && (
                                <p className="text-gray-700 mb-1">
                                    <strong>User Email:</strong> {sub.user.email}
                                </p>
                            )}
                            <p className="text-gray-700 mb-1">
                                <strong>Plan:</strong> {sub.planType}
                            </p>
                            {/* <p className="text-gray-700 mb-1">
                                <strong>Status:</strong> <span className="font-medium">{sub.status}</span> 
                            </p> */}
                            <p className="text-gray-700 mb-1">
                                <strong>Start Date:</strong> {formatDate(sub.startDate)}
                            </p>
                            <p className="text-gray-700 mb-1">
                                <strong>End Date:</strong> {sub.endDate ? formatDate(sub.endDate) : 'Ongoing'}
                            </p>
                            <p className={`font-semibold mb-1 ${sub.paymentStatus === 'active' ? 'text-green-600' : 'text-orange-600'}`}>
                                <strong>Payment Status:</strong> {sub.paymentStatus}
                            </p>
                            {sub.transactionId && (
                                <p className="text-gray-700">
                                    <strong>Transaction ID:</strong> {sub.transactionId}
                                </p>
                            )}
                            {sub.stripeSubscriptionId && ( // Show Stripe ID for debugging/reference
                                <p className="text-gray-700 text-sm">
                                    <strong>Stripe Sub ID:</strong> {sub.stripeSubscriptionId}
                                </p>
                            )}
                            {sub.nextBillingDate && (
                                <p className="text-blue-500">
                                    <strong>Next Billing:</strong> {formatDate(sub.nextBillingDate)}
                                </p>
                            )}
                            {sub.customerContact && (
                                <p className="text-gray-700">
                                    <strong>Contact:</strong> {sub.customerContact}
                                </p>
                            )}
                            {sub.customerAddress && (
                                <p className="text-gray-700">
                                    <strong>Address:</strong> {sub.customerAddress}
                                </p>
                            )}
                            {sub.notes && (
                                <p className="text-gray-600 italic">
                                    <strong>Notes:</strong> {sub.notes}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 italic text-center">No subscriptions found in the database.</p>
            )}
        </div>
    );
};

export default AdminAllSubscriptions;