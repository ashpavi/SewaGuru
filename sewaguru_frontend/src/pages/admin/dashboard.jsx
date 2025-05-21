import React, { useState, useEffect, useCallback } from 'react';
import { FaUserTie, FaUsers, FaTasks, FaShieldAlt, FaChartLine } from "react-icons/fa";
import AdminVerifyProviders from "./verifyProviders";
import api from '../../api/api';
import { getToken } from '../../utils/auth';
import Loader from '../../components/loader';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
    const [customerCount, setCustomerCount] = useState(null);
    const [providerCount, setProviderCount] = useState(null);
    const [subscriptionCount, setSubscriptionCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = getToken();

        if (!token) {
            setError('Authentication token missing. Please log in as an administrator.');
            toast.error('Authentication token missing. Please log in as an administrator.');
            setLoading(false);
            return;
        }

        try {
            const [
                customerCountResponse,
                providerCountResponse,
                subscriptionCountResponse
            ] = await Promise.all([
                api.get('/user/admin/customers/count', { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/user/admin/providers/count', { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/subscriptions/admin/count', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setCustomerCount(customerCountResponse.data.count);
            setProviderCount(providerCountResponse.data.count);
            setSubscriptionCount(subscriptionCountResponse.data.count);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            const errorMessage = err.response?.data?.message || 'Failed to fetch dashboard data.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full w-full min-h-[500px]">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-full w-full p-8 bg-white rounded-lg shadow-md">
                <div className="text-red-600 text-xl font-semibold mb-4">Error: {error}</div>
                <p className="text-gray-600 mb-6">There was a problem loading the dashboard data. Please try again.</p>
                <button
                    onClick={fetchDashboardData}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 lg:p-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
                 Dashboard Overview
            </h2>

            {/* Summary Cards with balanced colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <StatCard
                    icon={<FaUserTie />}
                    label="Registered Service Providers"
                    value={providerCount !== null ? providerCount : 'N/A'}
                    // Balanced purple/indigo
                    bgColor="bg-gradient-to-br from-indigo-300 to-purple-400"
                    iconBg="bg-indigo-700"
                />
                <StatCard
                    icon={<FaUsers />}
                    label="Registered Customers"
                    value={customerCount !== null ? customerCount : 'N/A'}
                    // Balanced green/emerald
                    bgColor="bg-gradient-to-br from-emerald-300 to-green-400"
                    iconBg="bg-emerald-700"
                />
                <StatCard
                    icon={<FaTasks />}
                    label="Total Subscriptions"
                    value={subscriptionCount !== null ? subscriptionCount : 'N/A'}
                    // Balanced blue/sky
                    bgColor="bg-gradient-to-br from-sky-300 to-blue-400"
                    iconBg="bg-sky-700"
                />
            </div>

            {/* Admin Actions/Sections */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                    Provider Verification
                </h3>
                <AdminVerifyProviders />
            </div>

            {/* You can add more sections here, e.g., Latest Bookings, Subscription Management */}
            {/* For example, if you want to display the All Subscriptions component here: */}
            {/*
            <div className="mt-12 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                    Subscription Management
                </h3>
                <AdminAllSubscriptions /> // Make sure to import AdminAllSubscriptions
            </div>
            */}
        </div>
    );
}

// StatCard component remains the same, accepting the new color props
function StatCard({ icon, label, value, bgColor, iconBg }) {
    return (
        <div className={`${bgColor} text-white flex items-center space-x-5 p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer`}>
            <div className={`${iconBg} p-3 rounded-full flex items-center justify-center text-3xl shadow-inner`}>
                {icon}
            </div>
            <div>
                <p className="text-3xl font-extrabold leading-none">{value}</p>
                <p className="text-sm opacity-90">{label}</p>
            </div>
        </div>
    );
}