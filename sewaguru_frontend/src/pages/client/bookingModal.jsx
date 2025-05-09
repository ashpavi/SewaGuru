// Updated BookingModal.jsx
import React, { useState, useEffect } from 'react';
import { FaSearchLocation } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from "../../api/api";

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

    useEffect(() => {
        setStep(1); // Reset to step 1 when the modal opens
        setProviders([]); // Clear previous providers
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

    const handleFindProviders = async () => {
        try {
            setLoading(true);
            setProviders([]); // Clear previous providers at the start

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
                setStep(3); // Directly move to Step 3 after fetching
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
            setLoading(false); // Ensure loading is set to false at the end
        }
    };


    const handleSelectProvider = (provider) => {
        toast.success(`Selected ${provider.firstName} ${provider.lastName}`);
        setStep(4);
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
                    <div key={index} className="p-4 border rounded flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <img src={provider.profilePicSrc} alt="Profile" className="w-12 h-12 rounded-full" />
                            <div>
                                <p className="font-semibold">{provider.firstName} {provider.lastName}</p>
                                <p className="text-sm text-gray-600">{provider.serviceType}</p>
                                <p className="text-sm text-gray-600">{provider.location}</p>
                                <p className="text-sm text-gray-600">{provider.address}</p>
                                <p className="text-sm text-yellow-500">Rating: {provider.rating} ★</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleSelectProvider(provider)}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Select Provider
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
        setStep((prev) => prev + 1);
    };

    const handlePreviousStep = () => {
        setStep((prev) => prev - 1);
    };


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
                                {subServices[category]?.map((service) => (
                                    <option key={service}>{service}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-4">
                            <select name="urgency" value={formData.urgency} onChange={handleChange} required className="w-full p-3 border rounded">
                                <option>Normal</option>
                                <option>Urgent</option>
                            </select>
                            <select name="complexity" value={formData.complexity} onChange={handleChange} required className="w-full p-3 border rounded">
                                <option>Simple</option>
                                <option>Moderate</option>
                                <option>Complex</option>
                            </select>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-3 border rounded" />
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the issue" className="w-full p-3 border rounded"></textarea>
                        </div>
                    )}
                    {step === 3 && renderProviders()}
                    <div className="flex justify-between">
                        {step > 1 && <button type="button" onClick={handlePreviousStep} className="px-4 py-2 bg-gray-300 rounded">Previous</button>}
                        <button
                            type="button"
                            onClick={step === 2 ? handleFindProviders : handleNextStep}
                            className="ml-auto px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            {step === 1 ? 'Next' : (step === 2 ? 'Find Providers' : 'Select Provider')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}