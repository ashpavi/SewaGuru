// SubscriptionPlans.jsx
import { useEffect, useState } from 'react';
import api from "../../api/api";
import Footer from '../../components/Footer';
import Header from '../../components/header';
import { token } from '../../utils/auth';
import SubscriptionDetailsModal from './subscriptionDetailsModal';


const subscriptionPlans = [
    {
        name: 'Home Essentials Plan',
        price: 'LKR 2,500/month',
        image: '/sub2.jpg',
        details: [
            '3 maintenance visits per month',
            'Plumbing & electrical support',
            '15% discount on emergency calls',
            'Coverage within 20km radius of Colombo',
            'Standard response time for scheduled visits',
            'Applicable for residential properties only',

        ],
        conditions: [
            'Visits are for general maintenance and minor repairs. Major repairs may incur additional charges.',
            'Free emergency visits, not parts.',
            'Service availability is subject to scheduling and technician availability.',
        ],
        planType: 'Home Essentials Plan' // Add planType to match backend enum
    },
    {
        name: 'Premium Care Plan',
        price: 'LKR 4,500/month',
        image: '/sub1.jpg',
        details: [
            '5 priority visits per month',
            'Free emergency visits',
            'All-inclusive maintenance coverage (within reasonable limits)',
            'Coverage within 20km radius of Colombo',
            'Priority response time for all service requests',
            'Applicable for residential and small commercial properties',

        ],
        conditions: [
            'Visits are for general maintenance and minor repairs. Major repairs may incur additional charges.',
            'Emergency call discounts apply to the service fee, not parts.',
            'Service availability is subject to scheduling and technician availability.',

        ],
        planType: 'Premium Care Plan'
    },
];

export default function SubscriptionPlans() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [subscriptionError, setSubscriptionError] = useState('');

    const handleProceedClick = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
        setSubscriptionError('');
    };

    const handlePayment = async (customerDetails) => {
        console.log(customerDetails); // This shows the correct data

        setIsLoading(true);
        setSubscriptionError('');
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.post(
                '/subscriptions',
                {
                    customerId: customerDetails.userId,     // Include customer ID
                    planType: customerDetails.plan.planType,
                    transactionId: `TEMP_${Date.now()}`, // Placeholder transaction ID
                    customerName: customerDetails.name,     // Include customer name
                    customerContact: customerDetails.contact, // Include customer contact
                    customerAddress: customerDetails.address, // Include customer address
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Subscription successful:', response.data);
            setIsLoading(false);
            closeModal();
            alert('Subscription successful!');
        } catch (error) {
            console.error('Error creating subscription:', error);
            setIsLoading(false);
            setSubscriptionError(error.response?.data?.message || 'Failed to create subscription. Please try again.');
        }
    };

    // Fetch user data to get the ID
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get("/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Handle error (e.g., redirect to login if not authenticated)
            }
        };

        fetchUserData();
    }, []);

    // Render nothing if user data is still loading
    if (!userData) {
        return <div>Loading user data...</div>;
    }

    const handleConfirmPayment = (plan, name, contact, address) => {
        // Include the userId in the customer details
        handlePayment({ plan, name, contact, address, userId: userData.id });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow py-10 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#104DA3] mb-2">Our Subscription Plans</h1>
                    <p className="text-gray-600">Enjoy continuous care and peace of mind with our subscription services.</p>
                    <p className="mt-2 text-sm text-red-500">* Subscription services are available within a 20km radius of Colombo only. Online payment required for subscription.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {subscriptionPlans.map((plan, index) => (
                        <div key={index} className="bg-white rounded-3xl shadow-xl p-8 flex flex-col">
                            <img
                                src={plan.image}
                                alt={plan.name}
                                className="w-full h-48 object-cover rounded-t-3xl mb-4"
                            />
                            <div className="flex-grow">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h2>
                                <p className="text-lg text-blue-500 font-semibold mb-4">{plan.price}</p>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Benefits:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                                    {plan.details.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                    ))}
                                </ul>
                                {plan.conditions && (
                                    <>
                                        <h3 className="text-md font-semibold text-gray-700 mb-2">Terms & Conditions:</h3>
                                        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 text-sm">
                                            {plan.conditions.map((condition, i) => (
                                                <li key={i}>{condition}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full shadow-md transition mt-4"
                                onClick={() => handleProceedClick(plan)}
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />

            {isModalOpen && selectedPlan && userData && (
                <SubscriptionDetailsModal
                    plan={selectedPlan}
                    onClose={closeModal}
                    onProceedToPayment={(name, contact, address) => handleConfirmPayment(selectedPlan, name, contact, address)}
                />
            )}

            {isLoading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="spinner-border animate-spin text-white w-10 h-10" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {subscriptionError && (
                <div className="fixed bottom-4 left-4 bg-red-200 text-red-700 border border-red-400 p-3 rounded-md shadow-md">
                    {subscriptionError}
                    <button onClick={() => setSubscriptionError('')} className="ml-2 font-bold">&times;</button>
                </div>
            )}
        </div>
    );
}