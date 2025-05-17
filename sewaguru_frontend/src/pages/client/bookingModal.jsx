import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaSearchLocation } from 'react-icons/fa';
import api from "../../api/api";
import { getToken } from '../../utils/auth';

const subServices = {
    'Home Service & Repairs': ['Plumbing', 'Electrical Repairs', 'Carpentry', 'Masonry & Tile Work', 'Door & Window Repair', 'Curtain Rod / Shelf Installation'],
    'Cleaning & Pest Control': ['Deep Cleaning', 'Kitchen & Bathroom Cleaning', 'Sofa & Mattress Cleaning', 'Termite Control', 'Cockroach / Ant / Bed Bug Control'],
    'Appliance Repair & Installation': ['AC Repair & Installation', 'Washing Machine Repair', 'Refrigerator Repair', 'Microwave / Oven Setup', 'TV Wall Mounting'],
    'Home Security & Smart Solutions': ['CCTV Installation', 'Smart Doorbell Setup', 'Alarm System Installation', 'Smart Lock Installation', 'Motion Sensor Setup'],
    'Moving & Transport': ['House Shifting', 'Office Relocation', 'Furniture Transport', 'Mini Truck Booking', 'Packing & Unpacking Services', 'Loading & Unloading Help'],
    'Tree & Garden Services': ['Lawn Mowing', 'Tree Trimming / Pruning', 'Garden Cleaning', 'Planting & Maintenance', 'Landscaping Services', 'Fertilizer & Soil Treatment']
};

const categoryMapping = {
    'Home Service & Repairs': 'home_service_repairs',
    'Cleaning & Pest Control': 'cleaning_pest_control',
    'Appliance Repair & Installation': 'appliance_repair_installation',
    'Home Security & Smart Solutions': 'home_security_solutions',
    'Moving & Transport': 'moving_transport',
    'Tree & Garden Services': 'tree_garden_services'
};


export default function BookingModal({ category, onClose }) {
    const [step, setStep] = useState(1);
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        location: '',
        address: '',
        subService: '',
        urgency: 'Normal',
        complexity: 'Simple',
        date: '',
        description: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [proceedButtonVisible, setProceedButtonVisible] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [userData, setUserData] = useState(null);

    // Fetch user data
    const getUserData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/user", {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            const userData = response.data;
            setUserData(userData);
            setCustomerId(userData.id); // Corrected line: changed userData._id to userData.id
            setFormData(prevFormData => ({
                ...prevFormData,
                fullName: userData.firstName || '', // changed from userData.fullName to userData.firstName
                phone: userData.phone || '',
            }));
            console.log("User data fetched:", userData);
            console.log("Customer ID from getUserData:", userData.id);
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Failed to fetch user data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserData();
        setStep(1);
        setProviders([]);
        setSelectedProvider(null);
        setProceedButtonVisible(false);
        setPaymentMethod('');
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [category, onClose]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFindProvidersAndProceed = async () => {
        await handleFindProviders();
    };

    const handleFindProviders = async () => {
        try {
            setLoading(true);
            setProviders([]);
            setSelectedProvider(null);
            setProceedButtonVisible(false);

            const formattedCategory = categoryMapping[category] || category;
            console.log("Finding providers with:", formattedCategory, formData.location);

            const response = await api.get('/bookings/providers', {
                params: {
                    serviceType: formattedCategory,
                    location: formData.location,
                },
            });

            console.log("API Response:", response.data);

            if (response.data && response.data.length > 0) {
                setProviders(response.data);
                console.log("Providers fetched successfully:", response.data);
                setStep(3);
                console.log("Providers set successfully:", response.data);
            } else {
                setProviders([]);
                toast.error("No providers found for the selected criteria.");
            }
        } catch (error) {
            console.error("Error fetching providers:", error);
            toast.error("Failed to find providers.");
            setProviders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProvider = (provider) => {
        setSelectedProvider(provider);
        toast.success(`Selected ${provider.firstName} ${provider.lastName}`);
        setProceedButtonVisible(true);
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} className="text-yellow-500">★</span>);
        }

        if (hasHalfStar) {
            stars.push(<span key="half" className="text-yellow-500">½</span>);
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
        }

        return stars;
    };

    const renderProviders = () => {
        if (loading) {
            return <p className="text-center text-gray-500">Loading providers...</p>;
        }

        if (!loading && providers.length === 0) {
            return <p className="text-center text-gray-500">No providers found for the selected service and location.</p>;
        }

        return (
            <div className="space-y-4">
                {providers.map((provider, index) => (
                    <div key={index} className={`p-4 border rounded flex justify-between items-center ${selectedProvider?._id === provider._id ? 'bg-blue-100 border-blue-500' : ''}`}>
                        <div className="flex items-center gap-4">
                            <img src={provider.profilePicSrc} alt="Profile" className="w-12 h-12 rounded-full" />
                            <div>
                                <p className="font-semibold">{provider.firstName} {provider.lastName}</p>
                                <p className="text-sm text-gray-600">{provider.serviceType}</p>
                                <p className="text-sm text-gray-600">{provider.location}</p>
                                <p className="text-sm text-gray-600">{provider.address}</p>
                                <p className="text-sm text-yellow-500">Rating: {renderStars(provider.rating)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleSelectProvider(provider)}
                            className={`px-4 py-2 rounded ${selectedProvider?._id === provider._id ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            disabled={selectedProvider?._id === provider._id}
                        >
                            {selectedProvider?._id === provider._id ? 'Selected' : 'Select'}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const handleNextStep = () => {
        if (step === 1 && (!formData.fullName || !formData.phone || !formData.location || !formData.address || !formData.subService)) {
            toast.error('Please fill all the required fields.');
            return;
        }
        if (step === 2 && (!formData.urgency || !formData.complexity || !formData.date)) {
            toast.error('Please fill all the required fields in Step 2.');
            return;
        }
        if (step === 3 && !selectedProvider) {
            toast.error('Please select a provider to proceed.');
            return;
        }
        if (step === 4 && !paymentMethod) {
            toast.error('Please select a payment method.');
            return;
        }
        setStep((prev) => prev + 1);
    };

    const handlePreviousStep = () => {
        setStep((prev) => prev - 1);
    };

    const handlePlaceBooking = async () => {
        try {
            setLoading(true);
            const bookingData = {
                ...formData,
                providerId: selectedProvider._id,
                providerName: `${selectedProvider.firstName} ${selectedProvider.lastName}`,
                paymentMethod: paymentMethod,
                status: 'pending',
                customerId: customerId, // Use the customerId state variable
                serviceType: categoryMapping[category] || category,
                bookingDate: formData.date,
            };

            console.log("Booking Data to send:", bookingData);
            console.log("Customer ID being sent:", customerId);

            const response = await api.post('/bookings/create', bookingData);
            console.log("Booking creation response:", response.data);
            toast.success('Booking placed successfully!');
            onClose();

        } catch (error) {
            console.error("Error placing booking:", error);
            toast.error('Failed to place booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderBookingSummary = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">Booking Summary</h3>
            <div className="border p-4 rounded-md">
                <h4 className="font-semibold">Customer Information</h4>
                <p><strong>Full Name:</strong> {formData.fullName}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Location:</strong> {formData.location}</p>
                <p><strong>Address:</strong> {formData.address}</p>
            </div>
            <div className="border p-4 rounded-md">
                <h4 className="font-semibold">Service Details</h4>
                <p><strong>Category:</strong> {category}</p>
                <p><strong>Sub-Service:</strong> {formData.subService}</p>
                <p><strong>Urgency:</strong> {formData.urgency}</p>
                <p><strong>Complexity:</strong> {formData.complexity}</p>
                <p><strong>Preferred Date:</strong> {formData.date}</p>
                <p><strong>Description:</strong> {formData.description || 'No description provided.'}</p>
                {formData.image && <p><strong>Image Attached:</strong> {formData.image.name}</p>}
            </div>
            {selectedProvider && (
                <div className="border p-4 rounded-md">
                    <h4 className="font-semibold">Selected Provider</h4>
                    <p><strong>Name:</strong> {selectedProvider.firstName} {selectedProvider.lastName}</p>
                    <p><strong>Service Type:</strong> {selectedProvider.serviceType}</p>
                    <p><strong>Location:</strong> {selectedProvider.location}</p>
                    <p><strong>Address:</strong> {selectedProvider.address}</p>
                    <p><strong>Rating:</strong> {renderStars(selectedProvider.rating)}</p>
                </div>
            )}
            <div className="border p-4 rounded-md">
                <h4 className="font-semibold">Payment Method</h4>
                <div className="flex gap-4">
                    <button
                        type="button"
                        className={`px-4 py-2 rounded ${paymentMethod === 'cash' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setPaymentMethod('cash')}
                        disabled={!!paymentMethod}
                    >
                        Cash
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded ${paymentMethod === 'online' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setPaymentMethod('online')}
                        disabled={!!paymentMethod}
                    >
                        Online
                    </button>
                </div>
                {paymentMethod && <p className="mt-2 text-sm text-gray-600">Selected: {paymentMethod}</p>}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-[#104DA3]">Book {category}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
                </div>
                <form className="p-6 space-y-4">
                    {step === 1 && (
                        <div className="space-y-4">
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required className="w-full p-3 border rounded" />
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required className="w-full p-3 border rounded" />
                            <div className="flex gap-2">
                                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Postal Code" required className="w-full p-3 border rounded" />
                                <a href="https://www.geonames.org/postalcode-search.html?q=&country=lk" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg">
                                    <FaSearchLocation /> Find
                                </a>
                            </div>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required className="w-full p-3 border rounded" />
                            <select name="subService" value={formData.subService} onChange={handleChange} required className="w-full p-3 border rounded">
                                <option value="" disabled>Select a Sub-Service</option>
                                {subServices[category]?.map((service) => (
                                    <option key={service} value={service}>{service}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-4">
                            <select name="urgency" value={formData.urgency} onChange={handleChange} required className="w-full p-3 border rounded">
                                <option value="" disabled>Select Urgency</option>
                                <option>Normal</option>
                                <option>Urgent</option>
                            </select>
                            <select name="complexity" value={formData.complexity} onChange={handleChange} required className="w-full p-3 border rounded">
                                <option value="" disabled>Select Complexity</option>
                                <option>Simple</option>
                                <option>Moderate</option>
                                <option>Complex</option>
                            </select>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-3 border rounded" />
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the issue" className="w-full p-3 border rounded"></textarea>
                        </div>
                    )}
                    {step === 3 && renderProviders()}
                    {step === 4 && renderBookingSummary()}

                    <div className="flex justify-between">
                        {step > 1 && <button type="button" onClick={handlePreviousStep} className="px-4 py-2 bg-gray-300 rounded">Previous</button>}
                        {(step === 3 || step === 4) && selectedProvider && (
                            <button
                                type="button"
                                onClick={step === 3 ? handleNextStep : handlePlaceBooking}
                                className="ml-auto px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                {step === 3 ? 'Proceed' : 'Place Booking'}
                            </button>
                        )}
                        {step !== 3 && step !== 4 && (
                            <button
                                type="button"
                                onClick={step === 1 ? handleNextStep : (step === 2 ? handleFindProvidersAndProceed : () => { })}
                                className={`ml-auto px-4 py-2 rounded ${(step === 1 || step === 2) ? 'bg-blue-500 text-white hover:bg-blue-600' :
                                    'bg-gray-400 text-white cursor-not-allowed'
                                    }`}
                                style={{ display: step === 3 ? 'none' : 'inline-block' }}
                                disabled={step === 3 && !selectedProvider}
                            >
                                {step === 1 ? 'Next' : (step === 2 ? 'Find Providers' : '')}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

