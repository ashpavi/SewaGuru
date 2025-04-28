import React, { useState } from "react";
import { motion } from "framer-motion";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Header from "../../components/header"; 
import Footer from "../../components/Footer"; 


const containerStyle = {
  width: "100%",
  height: "400px"
};

const center = {
  lat: 6.9271, // 📍 Colombo latitude
  lng: 79.8612 // 📍 Colombo longitude
};

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Complaint",
    message: ""
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAOzYXBomDluDeAbLCKFNziDCTw7ilJJ3s", // 🔥 Insert your real API Key here
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been submitted! 🚀");
    setFormData({ name: "", email: "", category: "Complaint", message: "" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center">
        {/* Banner */}
        <div className="w-full h-60 md:h-80 overflow-hidden">
          <img src="/contact.jpg" alt="Contact Banner" className="w-full h-full object-cover" />
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl w-full bg-white shadow-2xl rounded-3xl p-8 md:p-14 -mt-16 space-y-16 mb-10 z-10"
        >
          {/* Company Info */}
          <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#104DA3]">Get In Touch with SewaGuru</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Feel free to reach out to us for any complaints, service requests, or feedback. 
              We are committed to serving you better.
            </p>
          </section>

          {/* Contact Details + Form */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left: Contact Info */}
            <div className="space-y-6 text-gray-700">
              <h2 className="text-2xl font-bold text-[#104DA3] mb-4">Contact Information</h2>
              <p>📍 <span className="font-semibold">Address:</span> No. 123, Main Street, Colombo, Sri Lanka</p>
              <p>📞 <span className="font-semibold">Hotline:</span> +94 77 123 4567</p>
              <p>🚨 <span className="font-semibold text-red-600">Emergency Hotline:</span> +94 77 999 8888</p>
              <p>✉️ <span className="font-semibold">Email:</span> support@sewaguru.lk</p>
              <p>🕑 <span className="font-semibold">Working Hours:</span> 8:00 AM - 6:00 PM (Mon - Sat)</p>

              {/* Illustration */}
              <div className="w-64 mx-auto mt-8 hidden md:block">
                <img src="/contact2.jpg" alt="Contact Illustration" className="w-full" />
              </div>
            </div>

            {/* Right: Complaint Form */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-2xl shadow-inner">
              <h2 className="text-2xl font-bold text-[#104DA3] mb-2">Send Us a Message</h2>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
                required
              >
                <option>Complaint</option>
                <option>Service Request</option>
                <option>Feedback</option>
              </select>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
                rows="5"
                required
              ></textarea>

              <button
                type="submit"
                className="w-full bg-[#104DA3] hover:bg-blue-700 text-white font-bold py-3 rounded-full transition shadow-md"
              >
                Submit
              </button>
            </form>
          </section>

          {/* Google Map Section with Marker */}
          <section className="w-full">
            <h2 className="text-2xl font-bold text-[#104DA3] text-center mb-6">Locate Our Headquarters</h2>
            <div className="w-full h-80 rounded-3xl overflow-hidden shadow-lg">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={15}
                >
                  <Marker position={center} /> {/* 📍 Marker at Colombo HQ */}
                </GoogleMap>
              ) : (
                <div className="flex items-center justify-center h-full">Loading Map...</div>
              )}
            </div>
          </section>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
