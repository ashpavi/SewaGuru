// SubscriptionPlans.jsx
import { useEffect, useState } from 'react';
import api from "../../api/api"; // Assuming your axios instance is correctly configured here
import Footer from '../../components/Footer';
import Header from '../../components/header';
import { getToken } from '../../utils/auth'; // Utility to get JWT token
import SubscriptionDetailsModal from './subscriptionDetailsModal'; // Corrected capitalization for consistency

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
            'Free emergency visits, not parts.', // This condition might contradict "15% discount on emergency calls" in details. Clarify or remove one.
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
            'Free emergency visits', // This likely refers to the service fee, not parts. Clarify if needed.
            'All-inclusive maintenance coverage (within reasonable limits)',
            'Coverage within 20km radius of Colombo',
            'Priority response time for all service requests',
            'Applicable for residential and small commercial properties',
        ],
        conditions: [
            'Visits are for general maintenance and minor repairs. Major repairs may incur additional charges.',
            'Emergency call discounts apply to the service fee, not parts.', // This condition contradicts "Free emergency visits" in details. Clarify or remove one.
            'Service availability is subject to scheduling and technician availability.',
        ],
        planType: 'Premium Care Plan'
    },
];

export default function SubscriptionPlans() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State to store fetched user data
    const [userData, setUserData] = useState(null);
    // State to manage loading of user data
    const [isUserDataLoading, setIsUserDataLoading] = useState(true);
    // State to manage error during user data fetch
    const [userDataError, setUserDataError] = useState(null);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            console.log("No token found. User might need to log in.");
            setIsUserDataLoading(false); // Stop loading if no token
            setUserDataError("Please log in to view subscription plans.");
            // Optionally: navigate('/login'); // Uncomment if you want to redirect
            return;
        }

        const fetchUserData = async () => {
            setIsUserDataLoading(true);
            setUserDataError(null);
            try {
                
                const response = await api.get("/user", { 
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true // Important if your backend uses session cookies
                });
                // Assuming response.data contains user fields like _id, firstName, lastName, contactNumber, address
                // Adjust these field names based on your actual user model
                setUserData({
                    _id: response.data.id,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    contactNumber: response.data.contactNumber,
                    address: response.data.address,
                    // Add any other user data you need
                });
                console.log("Fetched User Data:", response.data); // Debugging
            } catch (error) {
                console.error("Error fetching user data:", error.response ? error.response.data : error.message);
                setUserDataError(error.response?.data?.message || 'Failed to load user data. Please try again.');
                // Handle error (e.g., redirect to login if token is invalid)
            } finally {
                setIsUserDataLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleProceedClick = (plan) => {
        if (!userData) {
            alert("User data is not loaded. Please ensure you are logged in and refresh the page.");
            return;
        }
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
        // Any other state resets if needed
    };

    if (isUserDataLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-grow flex items-center justify-center py-10">
                    <div>Loading user data...</div>
                </main>
                <Footer />
            </div>
        );
    }

    if (userDataError) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-grow flex items-center justify-center py-10">
                    <div className="text-red-600 font-semibold text-center">
                        {userDataError}
                        <p className="mt-2 text-sm text-gray-600">Please try logging in again or contact support.</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // If userData is null after loading and no error, it means user is not authenticated or data is empty.
    // This case should ideally be caught by userDataError if `getToken()` fails.
    // However, if the API returns an empty user object for some reason, this acts as a safeguard.
    if (!userData || !userData._id) { // Check if _id exists to ensure it's a valid user object
      return (
          <div className="flex flex-col min-h-screen bg-gray-50">
              <Header />
              <main className="flex-grow flex items-center justify-center py-10">
                  <div className="text-gray-600 font-semibold text-center">
                      User data could not be loaded or is incomplete. Please ensure you are logged in.
                  </div>
              </main>
              <Footer />
          </div>
      );
    }


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
                                Subscribe
                            </button>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />

            {/* The SubscriptionDetailsModal now contains the entire payment flow */}
            {isModalOpen && selectedPlan && userData && (
                <SubscriptionDetailsModal
                    plan={selectedPlan}
                    onClose={closeModal}
                    // Pass customerData to pre-fill the form in the modal
                    // Ensure the names match your User model fields from the backend /users/profile endpoint
                    customerData={{
                        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
                        contact: userData.contactNumber || '', // Assuming your user model has 'contactNumber'
                        address: userData.address || '',       // Assuming your user model has 'address'
                        userId: userData._id // Essential: Pass the MongoDB User ID
                    }}
                />
            )}
        </div>
    );
}