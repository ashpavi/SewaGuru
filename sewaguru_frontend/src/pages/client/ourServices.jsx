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

const serviceData = {
  "Home Service & Repairs": {
    image: homeRepairImg,
    description: "Hire a SewaGuru expert for top-notch home repairs, plumbing, and electrical services.",
    subServices: [
      "Plumbing Services: Pipe repairs, leak fixes, water heater installation, bathroom fittings, drainage cleaning.",
      "Electrical Services: Wiring installation, circuit repairs, fuse replacements, electrical appliance installations."
    ]
  },
  "Cleaning & Pest Control": {
    image: cleaningImg,
    description: "Keep your space clean and pest-free with our professional cleaning and pest control services.",
    subServices: [
      "House Cleaning: Deep cleaning, move-in/move-out cleaning, post-construction cleaning.",
      "Carpet & Sofa Cleaning: Professional cleaning of carpets, sofas, upholstery, and curtains."
    ]
  },
  "Appliance Repair & Installation": {
    image: applianceImg,
    description: "Get your appliances installed or repaired by certified SewaGuru technicians.",
    subServices: [
      "AC Repair & Servicing: Cleaning, gas refilling, repairing air conditioners.",
      "Refrigerator Repair: Troubleshooting, compressor replacement, cooling issues.",
      "Washing Machine Repair: Motor replacement, drum repair, draining problems."
    ]
  },
  "Home Security & Smart Solutions": {
    image: securityImg,
    description: "Secure your home with CCTV installation and smart automation solutions.",
    subServices: [
      "CCTV Installation: Home security camera setup, maintenance, and repairs.",
      "Smart Home Solutions: Smart lighting, smart thermostats, home automation."
    ]
  },
  "Moving & Transport": {
    image: movingImg,
    description: "Efficient and reliable moving, packing, and transportation services.",
    subServices: [
      "House Shifting: Packing, loading, unloading, and transportation of household items.",
      "Office Relocation: Furniture disassembly, packing, transportation, and setup at the new location."
    ]
  },
  "Tree & Garden Services": {
    image: gardenImg,
    description: "Professional tree care and gardening services to keep your outdoors beautiful and safe.",
    subServices: [
      "Coconut Tree Straightening: Supporting leaning coconut trees to prevent damage.",
      "Tree Pruning & Cutting: Trimming overgrown branches, cutting down unsafe trees, stump removal."
    ]
  }
};

export default function OurServices() {
  const [selectedCategory, setSelectedCategory] = useState("Home Service & Repairs");
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate(`/book-service?service=${encodeURIComponent(selectedCategory)}`);
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
                {/* Here you can add a small icon for each category too if you want */}
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
    </div>
  );
}
