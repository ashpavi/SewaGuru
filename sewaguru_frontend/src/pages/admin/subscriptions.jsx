import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { getToken } from '../../utils/auth';
import Loader from '../../components/loader'; 

const AdminActiveSubscriptions = () => {
    const [activeSubscriptions, setActiveSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActiveSubscriptions = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    setError('No authentication token found. Please log in as admin.');
                    setLoading(false);
                    return;
                }

                const response = await api.get('/subscriptions/admin/active', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setActiveSubscriptions(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch active subscriptions.');
                toast.error(error);
                setLoading(false);
            }
        };

        fetchActiveSubscriptions();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="container mx-auto p-8 text-center">
                <div className="text-red-500 text-xl mb-4">Error: {error}</div>
                <p className="text-gray-600">Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Active Subscriptions
            </h2>
            {activeSubscriptions.length > 0 ? (
                <ul className="space-y-4">
                    {activeSubscriptions.map((sub) => (
                        <li key={sub._id} className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {sub.customerName} ({sub.customerId?.firstName} {sub.customerId?.lastName})
                            </h3>
                            <p className="text-gray-700 mb-1">
                                <strong>Plan:</strong> {sub.planType}
                            </p>
                            <p className="text-gray-700 mb-1">
                                <strong>Start Date:</strong> {new Date(sub.startDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-700 mb-1">
                                <strong>End Date:</strong> {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'Ongoing'}
                            </p>
                            <p className="text-green-600 font-semibold mb-1">
                                <strong>Payment Status:</strong> {sub.paymentStatus}
                            </p>
                            <p className="text-gray-700">
                                <strong>Transaction ID:</strong> {sub.transactionId}
                            </p>
                            {sub.nextBillingDate && (
                                <p className="text-blue-500">
                                    <strong>Next Billing:</strong> {new Date(sub.nextBillingDate).toLocaleDateString()}
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
                <p className="text-gray-500 italic">No active subscriptions found.</p>
            )}
        </div>
    );
};

export default AdminActiveSubscriptions;