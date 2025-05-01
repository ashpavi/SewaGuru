import React from "react";
import { FaUser, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProviderProfile() {
  const profile = {
    firstName: "Nimal",
    lastName: "Perera",
    email: "nimal@sewaguru.lk",
    phone: "+94 77 123 4567",
    location: "Colombo 05",
    address: "No. 45, Flower Road, Colombo 05",
    serviceType: "AC Repair, Electrical Work",
    profilePic: "/images/profile.jpg",
    nicImages: ["/images/nic-front.jpg", "/images/nic-back.jpg"],
    policeCert: "/images/police-cert.jpg",
    gsCert: "/images/gs-cert.jpg",
    otherCerts: [
      "/images/training-cert.jpg",
      "/certificates/workshop.pdf"
    ]
  };

  // Reusable document display block
  const renderDocument = (label, fileUrl) => {
    const isPDF = fileUrl.toLowerCase().endsWith(".pdf");

    return (
      <div className="space-y-1">
        <p className="text-sm text-gray-600">{label}</p>
        {isPDF ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center h-48 border rounded-lg shadow-sm bg-red-100 text-red-600 font-medium hover:bg-red-200 transition text-center"
          >
            View PDF
          </a>
        ) : (
          <img
            src={fileUrl}
            alt={label}
            className="rounded-lg border shadow-sm w-full h-48 object-cover"
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <Link
          to="/provider/providerEditProfile"
          className="bg-[#104DA3] hover:bg-blue-800 text-white px-5 py-2 rounded-full font-medium text-sm shadow-md"
        >
          Edit Profile
        </Link>
      </div>

      {/* Profile Info */}
      <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col md:flex-row gap-8">
        <div className="flex justify-center md:w-1/3">
          <img
            src={profile.profilePic}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-[#48B8E3] shadow-md"
          />
        </div>

        <div className="flex-1 space-y-4">
          <div className="text-lg font-semibold text-gray-700">
            {profile.firstName} {profile.lastName}
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2"><FaEnvelope className="text-[#48B8E3]" /> {profile.email}</p>
            <p className="flex items-center gap-2"><FaPhoneAlt className="text-[#48B8E3]" /> {profile.phone}</p>
            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#48B8E3]" /> {profile.location}</p>
            <p><span className="font-medium">Address:</span> {profile.address}</p>
            <p><span className="font-medium">Service Type:</span> {profile.serviceType}</p>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Uploaded Documents</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {profile.nicImages.map((img, i) =>
            renderDocument(`NIC ${i === 0 ? "Front" : "Back"}`, img)
          )}
          {renderDocument("Police Certificate", profile.policeCert)}
          {renderDocument("GS Certificate", profile.gsCert)}
        </div>

        {/* Other Qualifications */}
        {profile.otherCerts && profile.otherCerts.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 pt-4">Other Qualifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {profile.otherCerts.map((file, index) =>
                renderDocument(`Document ${index + 1}`, file)
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
