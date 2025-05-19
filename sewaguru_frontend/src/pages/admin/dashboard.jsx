import React, { useState, useEffect } from 'react';
import { FaUserTie, FaUsers, FaTasks } from "react-icons/fa";
import AdminVerifyProviders from "./verifyProviders";
import api from '../../api/api';
import { getToken } from '../../utils/auth';
import Loader from '../../components/loader'; // Assuming you have a Loader component

export default function AdminDashboard() {
    const [customerCount, setCustomerCount] = useState(null);
    const [providerCount, setProviderCount] = useState(null);
    const [subscriptionCount, setSubscriptionCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            const token = getToken();

            if (!token) {
                setError('Authentication token missing.');
                setLoading(false);
                return;
            }

            try {
                const customerCountResponse = await api.get('/user/admin/customers/count', { headers: { Authorization: `Bearer ${token}` } });
                setCustomerCount(customerCountResponse.data.count);

                const providerCountResponse = await api.get('/user/admin/providers/count', { headers: { Authorization: `Bearer ${token}` } });
                setProviderCount(providerCountResponse.data.count);

                const subscriptionCountResponse = await api.get('/subscriptions/admin/count', { headers: { Authorization: `Bearer ${token}` } });
                setSubscriptionCount(subscriptionCountResponse.data.count);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to fetch dashboard data.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <Loader />; // Or a loading indicator
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="h-full w-full">
            <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Admin’s Dashboard</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <StatCard
                    icon={<FaUserTie />}
                    label="Registered Service Providers"
                    value={providerCount !== null ? providerCount : 'Loading...'}
                />
                <StatCard
                    icon={<FaUsers />}
                    label="Registered Customers"
                    value={customerCount !== null ? customerCount : 'Loading...'}
                />
                <StatCard
                    icon={<FaTasks />}
                    label="Total Subscriptions"
                    value={subscriptionCount !== null ? subscriptionCount : 'Loading...'}
                />
            </div>

            {/* Latest Requests */}
            <div>
                <AdminVerifyProviders />
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