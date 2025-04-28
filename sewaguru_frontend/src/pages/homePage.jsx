
import { HiSearch } from "react-icons/hi";
import {
  FaBroom,
  FaPaintRoller,
  FaPlug,
  FaLeaf,
  FaTruckMoving,
  FaToilet,
  FaPhoneAlt,
  FaMapMarkerAlt
} from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/Footer";
import { useState } from "react";

import { Button} from "flowbite-react";



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
    // Add your backend call here
    setIsOpen(false);
    setForm({ fullName: "", contact: "", issue: "", address: "" });
  };

  return (
    <div className="w-full h-screen bg-white max-h-screen  text-gray-800">
      <Header/>
      

     
      {/* Hero Section with Search */}
        <section className="bg-gray-100 w-full py-12">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
            {/* Left: Text + Search */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-5xl font-bold text-blue-700 leading-tight">
                We provide <br />
                <span className="text-black">quality service</span>
              </h1>
              <p className="text-lg text-gray-700">We work 24 hours a day to serve your home needs.</p>

              {/* Search Bar */}
              <div className="flex w-full max-w-md border rounded-xl overflow-hidden shadow-md">
                <input
                  type="text"
                  placeholder="Search services..."
                  className="flex-1 px-4 py-2 outline-none"
                />
                <Button color="info" className="flex items-center gap-2 rounded-none">
                  <HiSearch className="text-lg" />
                  Search
                </Button>
              </div>

              {/* Contact/CTA */}
              <div className="flex items-center gap-4 text-sm text-gray-600 pt-4">
                <div className="flex items-center gap-2"><FaMapMarkerAlt />
                126/2A, Main Street, Homagama
                </div>
                <div className="flex items-center gap-2"><FaPhoneAlt />
                +94 77 002 1234
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="flex justify-center">
              <img
                src="/Hero 1.jpg"
                alt="Hero Worker"
                className="w-full max-w-md md:max-w-full rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>


      {/* Emergency Services Section */}       
        <section className="relative py-12 px-8">
        <div className="max-w-5xl mx-auto relative z-10 border-3 border-red-300 rounded-2xl bg-red-50/80 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-white to-red-50 opacity-30 pointer-events-none rounded-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 p-8">
            {/* Left */}
            <div className="space-y-5 max-w-xl">
              <h2 className="text-3xl font-bold text-red-600">
                Emergency Services, Anytime
              </h2>
              <p className="text-gray-700 text-lg">
                We're here for you 24/7. Whether it's a burst pipe, sudden power outage, or a security concern — just give us a call.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-white text-base font-semibold">
                <div className="bg-red-600 px-5 py-3 rounded-lg flex items-center gap-3 shadow-md">
                  <FaPhoneAlt />
                  <span>+94 77 111 4444 </span>
                </div>
                <button
                onClick={() => setIsOpen(true)}
                className="bg-red-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-red-700 transition"
              >
                Request Emergency Help
              </button>
              </div>
              <p className="text-sm text-gray-600 pt-2">
                We're available in Homagama and nearby towns.
              </p>
              
            </div>

            {/* Right */}
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


      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
            {/* Close Button */}
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
              <div>
                <label className="block font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Contact (Phone/Email)</label>
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Issue Description</label>
                <textarea
                  name="issue"
                  value={form.issue}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Address / Location</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                  rows="2"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition"
              >
                Submit Emergency Request
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Services Icons */}
      <section className="py-10 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 md:grid-cols-6 gap-6 text-center text-sm text-gray-700">
              {[ 
                { icon: <FaBroom size={30} />, label: "Cleaning" },
                { icon: <FaToilet size={30} />, label: "Plumbing" },
                { icon: <FaPlug size={30} />, label: "Electrician" },
                { icon: <FaPaintRoller size={30} />, label: "Painting" },
                { icon: <FaLeaf size={30} />, label: "Gardening" },
                { icon: <FaTruckMoving size={30} />, label: "Moving" },
              ].map((service, i) => (
                <div key={i} className="flex flex-col items-center gap-2 transition duration-300 transform hover:scale-105 hover:opacity-90">
                  <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center shadow-md">
                    {service.icon}
                  </div>
                  <span>{service.label}</span>
                </div>
              ))}
            </div>
      </section>


      {/* Popular Services Near You */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h4 className="text-xl font-semibold mb-4">Popular Services Near You</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["AC Repair", "Pest Control", "Packers & Movers", "Home Cleaning", "CCTV Setup", "Car Wash"].map((service, i) => (
              <div key={i} className="bg-lime-100 text-center px-4 py-3 rounded-lg shadow-sm font-medium">
                {service}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Subscription Based Services */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h4 className="text-xl font-semibold mb-6">Subscription Based Services</h4>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-lime-100 rounded-xl overflow-hidden shadow-md">
                <img
                  src={`https://placehold.co/600x300?text=Plan+${item}`}
                  alt={`Plan ${item}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h5 className="text-lg font-semibold mb-2">Popular Plan - LKR 2,500/month</h5>
                  <ul className="list-disc pl-5 text-sm text-gray-700 mb-4">
                    <li>3 home visits / month</li>
                    <li>Emergency support</li>
                    <li>20% discount on additional services</li>
                  </ul>
                  <Button color="warning">Learn More</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h4 className="text-xl font-semibold mb-6">See what happy customers are saying about SewaGuru</h4>
          <div className="grid md:grid-cols-2 gap-6">
            {["Elizabeth", "Ehsan"]?.map((name, i) => (
              <div
                key={i}
                className="bg-gray-100 p-5 rounded-xl shadow-md text-sm text-gray-800"
              >
                <p className="mb-2">“Great experience! They arrived on time and completed the work flawlessly.”</p>
                <div className="font-semibold">{name} ⭐⭐⭐⭐⭐</div>
              </div>
            ))}
          </div>
        </div>

      </section>
      <Footer/>
    </div>
    
  )
}

