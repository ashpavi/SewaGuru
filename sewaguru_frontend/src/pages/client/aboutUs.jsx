
import { motion } from "framer-motion";
import { FaCheckCircle, FaUserShield, FaTools, FaBolt, FaMobileAlt } from "react-icons/fa";

import { Link } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/Footer";


export default function AboutUsPage() {
  return (
    <div className="w-full h-screen bg-white max-h-screen  text-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white py-16 px-4 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-blue-800 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About SewaGuru
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Sri Lanka’s leading home service marketplace — Reliable, Affordable, Trusted.
        </motion.p>
      </section>

      {/* Who We Are */}
      <section className="py-12 bg-white px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <img src="/construction.jpg" alt="About SewaGuru" className="rounded-xl shadow-lg w-full " />
        <div>
          <h2 className="text-3xl font-semibold text-blue-700 mb-4">Who We Are</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            SewaGuru is Sri Lanka’s leading home service marketplace, connecting customers with trusted professionals for a wide range of services. From cleaning and maintenance to personal care and events, we make life easier — one service at a time.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-blue-50 py-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-blue-700 mb-4">Our Mission</h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg">
            Our goal is to simplify daily life by offering a reliable, hassle-free, and affordable platform where customers can access high-quality services with just a few clicks. We empower local providers through fair pricing, customer trust, and quality assurance.
          </p>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-blue-700 mb-8 text-center">Why Choose SewaGuru?</h2>
        <div className="grid md:grid-cols-3 gap-8 justify-center text-center items-center">
          {[
            { icon: <FaTools size={30} />, title: "Wide Range of Services" },
            { icon: <FaUserShield size={30} />, title: "Verified Professionals" },
            { icon: <FaCheckCircle size={30} />, title: "Transparent Pricing" },
            { icon: <FaBolt size={30} />, title: "Quick Service" },
            { icon: <FaMobileAlt size={30} />, title: "Easy Booking" },
            { icon: <FaUserShield size={30} />, title: "Secure & Trusted" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-blue-600 mb-3">{feature.icon}</div>
              <h4 className="text-lg font-semibold">{feature.title}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Join Us */}
      <section className="bg-lime-100 py-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-green-700 mb-4">Join Us as a Service Provider</h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg mb-6">
            Are you a skilled professional looking to expand your business? Become a SewaGuru and reach more customers. We provide the platform, marketing, and support — you provide the expertise.
          </p>
          <Link to="/provider/providerRegister" className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition">Register Now</Link>
        </motion.div>
      </section>

      {/* Our Commitment */}
      <section className="py-12 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-blue-700 mb-4">Our Commitment</h2>
        <p className="text-gray-700 text-lg">
          At SewaGuru, we believe in quality, trust, and convenience. We're always improving our platform to meet the evolving needs of Sri Lankan homes and businesses.
        </p>
        <p className="text-sm text-gray-600 mt-6">
          📍 Want to know more? Visit our Contact Us page or email us at <a className="text-blue-500" href="mailto:sewaguru@gmail.com">sewaguru@gmail.com</a>
        </p>
      </section>

      <Footer />
    </div>
  );
}
