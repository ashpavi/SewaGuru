// HomePage.jsx
import { HiSearch } from "react-icons/hi";
import {
  FaBroom,
  FaPaintRoller,
  FaPlug,
  FaLeaf,
  FaTruckMoving,
  FaToilet,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaTools,
} from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/Footer";
import { useState } from "react";
import { Button } from "flowbite-react";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    contact: "",
    issue: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Emergency Request Submitted:", form);
    setIsOpen(false);
    setForm({ fullName: "", contact: "", issue: "", address: "" });
  };

  const mainServices = [
    { icon: <FaTools size={30} />, label: "Home Service & Repairs" },
    { icon: <FaBroom size={30} />, label: "Cleaning & Pest Control" },
    { icon: <FaPlug size={30} />, label: "Appliance Repair & Installation" },
    { icon: <FaShieldAlt size={30} />, label: "Home Security & Smart Solutions" },
    { icon: <FaTruckMoving size={30} />, label: "Moving & Transport" },
    { icon: <FaLeaf size={30} />, label: "Tree & Garden Services" },
  ];

  const testimonials = [
    {
      name: "Elizabeth Perera",
      text: "Absolutely amazing service! The plumber was professional and fixed the issue fast.",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      name: "Nuwan Fernando",
      text: "Highly recommend SewaGuru! They helped us move and it was smooth and stress-free.",
      rating: "⭐⭐⭐⭐⭐",
    },
  ];

  return (
    <div className="w-full bg-white text-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-700 leading-tight">
              We provide <br />
              <span className="text-black">quality service</span>
            </h1>
            <p className="text-lg text-gray-700">
              We work 24 hours a day to serve your home needs.
            </p>
            <div className="flex w-full max-w-md border rounded-xl overflow-hidden shadow-md">
              <input
                type="text"
                placeholder="Search services..."
                className="flex-1 px-4 py-2 outline-none"
              />
              <Button color="info" className="flex items-center gap-2 rounded-none">
                <HiSearch className="text-lg" /> Search
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 pt-4">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt /> No. 123, Main Street, Colombo, Sri Lanka
              </div>
              <a href="tel:+94771234567" className="flex items-center gap-2 text-blue-600 hover:underline">
                <FaPhoneAlt /> +94 77 123 4567
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/Hero 1.jpg"
              alt="Hero Worker"
              className="w-full max-w-md md:max-w-full rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-12 px-8">
        <div className="max-w-5xl mx-auto border-3 border-red-300 rounded-2xl bg-red-50/80 shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-white to-red-50 opacity-30 rounded-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 p-8">
            <div className="space-y-5 max-w-xl">
              <h2 className="text-3xl font-bold text-red-600">Emergency Services, Anytime</h2>
              <p className="text-gray-700 text-lg">
                We're here for you 24/7. Whether it's a burst pipe, sudden power outage, or a security concern — just give us a call.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-white font-semibold">
                <a
                  href="tel:+94771114444"
                  className="bg-red-600 px-5 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-red-700 transition"
                >
                  <FaPhoneAlt /> <span>+94 77 111 4444</span>
                </a>
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-red-600 px-5 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Request Emergency Help
                </button>
              </div>
              <p className="text-sm text-gray-600 pt-2">
                We're available in Homagama and nearby towns.
              </p>
            </div>
            <div className="flex justify-center w-full max-w-xs">
              <img
                src="/plumbing.jpg"
                alt="Emergency Help"
                className="w-full h-auto object-cover drop-shadow-xl rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

     {/* Services Grid */}
<section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h3 className="text-3xl font-bold mb-10 text-gray-800">Our Main Service Categories</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {mainServices.map((s, i) => (
        <div
          key={i}
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 flex flex-col items-center border border-gray-200 hover:border-gray-400"
        >
          <div className="w-16 h-16 mb-4 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center shadow-lg">
            {s.icon}
          </div>
          <h5 className="font-semibold text-lg text-blue-700">{s.label}</h5>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Subscription Plans */}
<section className="py-16 bg-gradient-to-br from-yellow-50 to-white">
  <div className="max-w-6xl mx-auto px-6">
    <h3 className="text-3xl font-bold text-center mb-12 text-yellow-800">Subscription Based Services</h3>
    <div className="grid md:grid-cols-2 gap-10">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-yellow-100 hover:border-yellow-300"
        >
          <img
            src={item === 1 ? "/sub2.jpg" : "/sub1.jpg"}
            alt={item === 1 ? "Home Essentials Plan" : "Premium Care Plan"}
            className="w-full h-60 object-cover"
          />
          <div className="p-6">
            <h5 className="text-2xl font-bold mb-3 text-yellow-800">
              {item === 1 ? "Home Essentials Plan - LKR 2,500/month" : "Premium Care Plan - LKR 4,500/month"}
            </h5>
            <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm mb-5">
              {item === 1 ? (
                <>
                  <li>3 maintenance visits per month</li>
                  <li>Plumbing & electrical support</li>
                  <li>15% discount on emergency calls</li>
                </>
              ) : (
                <>
                  <li>5 priority visits per month</li>
                  <li>Free emergency visits</li>
                  <li>All-inclusive maintenance coverage</li>
                </>
              )}
            </ul>
            <Button color="warning" className="w-full py-2">Learn More</Button>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* Testimonials */}
<section className="py-16 bg-gradient-to-tr from-gray-100 to-white">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h3 className="text-3xl font-bold mb-10 text-gray-800">What Our Customers Say</h3>
    <div className="grid md:grid-cols-2 gap-8">
      {testimonials.map((t, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 shadow hover:shadow-xl transition-all text-left"
        >
          <p className="text-gray-700 italic mb-3 leading-relaxed">“{t.text}”</p>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">{t.name}</span>
            <span className="text-yellow-500 text-lg">{t.rating}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Emergency Request Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-red-600 mb-4 text-center">
              Emergency Request Form
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2" required />
              <input name="contact" placeholder="Contact (Phone/Email)" value={form.contact} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2" required />
              <textarea name="issue" placeholder="Issue Description" value={form.issue} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2" rows="3" required></textarea>
              <textarea name="address" placeholder="Address / Location" value={form.address} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2" rows="2" required></textarea>
              <button type="submit" className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition">Submit Emergency Request</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
