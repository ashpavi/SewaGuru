import { motion } from "framer-motion";
import Header from "../components/header";
import Footer from "../components/Footer";
import { FaShieldAlt, FaFileSignature, FaEnvelopeOpenText, FaMapMarkedAlt, FaMoneyBillWave } from "react-icons/fa";


export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-white text-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-100 to-white py-16 px-4 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-blue-700 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Privacy Policy
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Your data. Our priority. Learn how SewaGuru protects your privacy and ensures security.
        </motion.p>
      </section>

      

      {/* Main Content Section */}
      <section className="py-12 px-6 max-w-6xl mx-auto space-y-12">
        {[
          {
            icon: <FaShieldAlt />, title: "Information Collected", content: `We collect personal details like your name, email, phone number, and home or office location. Other service preferences or feedback may also be collected to improve our offerings.`
          },
          {
            icon: <FaEnvelopeOpenText />, title: "Why We Collect Your Data", content: (
              <ul className="list-disc pl-5 space-y-2">
                <li>To identify and authenticate customers or providers.</li>
                <li>Enable seamless service requests and provider matching.</li>
                <li>Communicate confirmations, updates, and feedback requests.</li>
              </ul>
            )
          },
          {
            icon: <FaMapMarkedAlt />, title: "Use of Collected Information", content: (
              <ul className="list-disc pl-5 space-y-2">
                <li>Email confirmations and service status updates.</li>
                <li>Service provider assignment and visit planning.</li>
                <li>Improving platform security and performance.</li>
              </ul>
            )
          },
          {
            icon: <FaFileSignature />, title: "Becoming a SewaGuru", content: (
              <>
                <p className="mb-2">Providers must register and upload verification documents to ensure trust and quality.</p>
                <ul className="list-disc pl-5">
                  <li>NIC for identity verification</li>
                  <li>Gramasevaka Certificate for residence proof</li>
                  <li>Police Clearance for background check</li>
                  <li>Licenses/certifications for professionals</li>
                </ul>
              </>
            )
          },
          {
            icon: <FaShieldAlt />, title: "Service Quality & Ethics", content: `Providers must comply with our ethical standards and maintain service quality. Misuse of data or false information may result in account suspension.`
          },
          {
            icon: <FaMoneyBillWave />, title: "Payments & Quotations", content: (
              <ul className="list-disc pl-5">
                <li>Quotes issued after site visits, valid for 1 month.</li>
                <li>Advance payments required for jobs over LKR 30,000.</li>
                <li>Acceptable payments: Cash, bank transfer, online.</li>
                <li>Invoices must be settled within two weeks.</li>
              </ul>
            )
          },
          {
            title: "Respecting Our Terms", content: `By using SewaGuru, users agree to our Privacy Policy and Terms & Conditions. We reserve the right to update terms for better service quality.`
          },
          {
            title: "Contact Us", content: `Got questions or suggestions? Email us at sewaguru@gmail.com or visit the Contact Us page.`
          }
        ].map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
              {section.icon} {section.title}
            </h2>
            <div className="text-gray-700 leading-relaxed text-base">
              {section.content}
            </div>
          </motion.div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
