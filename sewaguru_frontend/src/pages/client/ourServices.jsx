// OurServices.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/Footer";


import homeRepairImg from "../../assets/services/home-repair.jpg";
import cleaningImg from "../../assets/services/cleaning.jpg";
import applianceImg from "../../assets/services/appliance.jpg";
import securityImg from "../../assets/services/security.jpg";
import movingImg from "../../assets/services/moving.jpg";
import gardenImg from "../../assets/services/garden.jpg";
import BookingModal from "./bookingModal";

const serviceData = {
  "Home Service & Repairs": {
    image: homeRepairImg,
    description: "Professional help for all your household repair needs — from plumbing leaks to electrical fixes and handyman support, we’ve got your home covered.",
    subServices: [
      "Plumbing (leaks, fittings, drainage)",

      "Electrical Repairs (wiring, sockets, switches)",

      "Carpentry (furniture fixing, hinge alignment)",

      "Masonry & Tile Work (tile fixing, wall repair)", 

      "Door & Window Repair",

      "Curtain Rod / Shelf Installation"
    ]
  },
  "Cleaning & Pest Control": {
    image: cleaningImg,
    description: "Keep your space clean and pest-free with our professional cleaning and pest control services.",
    subServices: [
      "Home Deep Cleaning",

      "Kitchen & Bathroom Cleaning",

      "Sofa & Mattress Cleaning",

      "Carpet & Curtain Cleaning",

      "Termite Control",

      "Cockroach / Ant / Bed Bug Control",

      "Disinfection & Sanitization"
    ]
  },
  "Appliance Repair & Installation": {
    image: applianceImg,
    description: "Get your appliances installed or repaired by certified SewaGuru technicians.",
    subServices: [
      "AC Repair & Installation",
      "Washing Machine Repair",

      "Refrigerator Repair",

      "Microwave / Oven Setup",

      "TV Wall Mounting",

      "Water Heater (Geyser) Installation",

      "Inverter / Stabilizer Setup"
    ]
  },
  "Home Security & Smart Solutions": {
    image: securityImg,
    description: "Secure your home with CCTV installation and smart automation solutions.",
    subServices: [
      "CCTV Installation",

      "Smart Doorbell Setup",

      "Video Intercom Installation",

      "Alarm System Installation",

"Smart Lock Installation",

"Motion Sensor Setup",

"Wi-Fi Router / IoT Configuration"
    ]
  },
  "Moving & Transport": {
    image: movingImg,
    description: "Efficient and reliable moving, packing, and transportation services.",
    subServices: [
      "House Shifting (Local / Long Distance)",

"Office Relocation",

"Furniture Transport",

"Mini Truck Booking",

"Packing & Unpacking Services",

"Loading & Unloading Help"
    ]
  },
  "Tree & Garden Services": {
    image: gardenImg,
    description: "Professional tree care and gardening services to keep your outdoors beautiful and safe.",
    subServices: [
      "Lawn Mowing",

"Tree Trimming / Pruning",

"Garden Cleaning",

"Planting & Maintenance",

"Outdoor Pest Control",

"Landscaping Services",

"Fertilizer & Soil Treatment"
    ]
  }
};

export default function OurServices() {
  const [selectedCategory, setSelectedCategory] = useState("Home Service & Repairs");
  const [showModal, setShowModal] = useState(false);

  const handleBooking = () => {
    setShowModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full py-10 px-6 gap-8">
        {/* Left: Categories */}
        <div className="w-full md:w-1/3 space-y-4">
          <h2 className="text-2xl font-bold text-[#104DA3] mb-4">Categories</h2>
          <div className="flex flex-col gap-4">
            {Object.keys(serviceData).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-md transition ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Selected Service Details */}
        <div className="w-full md:w-2/3 bg-white shadow-xl rounded-3xl p-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={serviceData[selectedCategory].image}
              alt={selectedCategory}
              className="w-full md:w-56 h-56 object-cover rounded-3xl shadow-md"
            />
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-bold text-[#104DA3]">{selectedCategory}</h1>
              <p className="text-gray-600">{serviceData[selectedCategory].description}</p>
            </div>
          </div>

          {/* Sub-Services List */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Our Services at a Glance:</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {serviceData[selectedCategory].subServices.map((sub, index) => (
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
      </main>

      <Footer />

      {showModal && (
        <BookingModal
          category={selectedCategory}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
