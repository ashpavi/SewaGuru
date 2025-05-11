// OurServices.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/Footer";
import BookingModal from "./bookingModal";
import serviceData from '../../data/services'; // Import service data

export default function OurServices() {
    const [selectedCategory, setSelectedCategory] = useState(Object.keys(serviceData)[0]);
    const [showModal, setShowModal] = useState(false);
    const [filteredServices, setFilteredServices] = useState(serviceData);
    const [searchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        const query = searchParams.get("query");
        if (query) {
            const searchTerm = query.toLowerCase();
            const results = {};
            for (const category in serviceData) {
                if (category.toLowerCase().includes(searchTerm) || serviceData[category].subServices.some(sub => sub.toLowerCase().includes(searchTerm))) {
                    results[category] = serviceData[category];
                }
            }
            setFilteredServices(results);
            // If there's a match, select the first matching category
            if (Object.keys(results).length > 0) {
                setSelectedCategory(Object.keys(results)[0]);
            }
        } else {
            setFilteredServices(serviceData);
            setSelectedCategory(Object.keys(serviceData)[0]); // Reset to the first category if no query
        }
    }, [searchParams, serviceData]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleBooking = () => {
        setShowModal(true);
    };

    const displayedCategoryData = filteredServices[selectedCategory] || serviceData[selectedCategory] || Object.values(filteredServices)[0] || Object.values(serviceData)[0];
    const displayedCategoryName = displayedCategoryData ? Object.keys(filteredServices).find(key => filteredServices[key] === displayedCategoryData) || Object.keys(serviceData).find(key => serviceData[key] === displayedCategoryData) : "";

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full py-10 px-6 gap-8">
                {/* Left: Categories */}
                <div className="w-full md:w-1/3 space-y-4">
                    <h2 className="text-2xl font-bold text-[#104DA3] mb-4">Categories</h2>
                    <div className="flex flex-col gap-4">
                        {Object.keys(filteredServices).map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-md transition ${
                                    selectedCategory === category
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-gray-700 hover:bg-blue-100"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                        {Object.keys(filteredServices).length < Object.keys(serviceData).length && (
                            <button
                                onClick={() => {
                                    setFilteredServices(serviceData);
                                    setSelectedCategory(Object.keys(serviceData)[0]);
                                }}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-md transition bg-white text-gray-700 hover:bg-blue-100"
                            >
                                View All Services
                            </button>
                        )}
                    </div>
                </div>

                {/* Right: Selected Service Details */}
                {displayedCategoryData && (
                    <div className="w-full md:w-2/3 bg-white shadow-xl rounded-3xl p-8 space-y-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <img
                                src={displayedCategoryData.image}
                                alt={displayedCategoryName}
                                className="w-full md:w-56 h-56 object-cover rounded-3xl shadow-md"
                            />
                            <div className="flex-1 space-y-4">
                                <h1 className="text-3xl font-bold text-[#104DA3]">{displayedCategoryName}</h1>
                                <p className="text-gray-600">{displayedCategoryData.description}</p>
                            </div>
                        </div>

                        {/* Sub-Services List */}
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-gray-800">Our Services at a Glance:</h2>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {displayedCategoryData.subServices.map((sub, index) => (
                                    <li key={index}>{sub}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Book Appointment Button */}
                        <div className="text-center pt-4">
                            <button
                                onClick={handleBooking}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full shadow-md transition"
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                )}
                {!displayedCategoryData && (
                    <div className="w-full md:w-2/3 bg-white shadow-xl rounded-3xl p-8 space-y-8">
                        <h2 className="text-2xl font-semibold text-gray-800 text-center">No services found matching your search.</h2>
                    </div>
                )}
            </main>

            <Footer />

            {showModal && (
                <BookingModal
                    category={displayedCategoryName}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}