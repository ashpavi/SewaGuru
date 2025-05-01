import React, { useState } from "react";

export default function ProviderEditProfile() {
  const [formData, setFormData] = useState({
    firstName: "Nimal",
    lastName: "Perera",
    email: "nimal@sewaguru.lk",
    phone: "+94 77 123 4567",
    location: "Colombo 05",
    address: "No. 45, Flower Road, Colombo 05",
    serviceType: "AC Repair, Electrical Work",
    profilePic: "",
    nicImages: [],
    policeCert: "",
    gsCert: "",
    otherQualifications: []
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "nicImages" || name === "otherQualifications") {
        setFormData({ ...formData, [name]: Array.from(files) });
      } else {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", formData);
    alert("Profile updated successfully!");
    // You can POST this data to backend here
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Edit My Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-6">
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City / Area"
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full Address"
            className="p-3 border rounded-lg w-full col-span-2"
          />
          <input
            type="text"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            placeholder="Service Types (comma separated)"
            className="p-3 border rounded-lg w-full col-span-2"
          />
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            name="profilePic"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* NIC Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NIC (Front & Back)</label>
          <input
            type="file"
            accept="image/*"
            name="nicImages"
            multiple
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Certificates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Police Certificate</label>
            <input
              type="file"
              accept="image/*"
              name="policeCert"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GS Certificate</label>
            <input
              type="file"
              accept="image/*"
              name="gsCert"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          {/* Other Qualifications */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Other Qualifications (Optional)</label>
            <input
                type="file"
                accept="image/*,application/pdf"
                name="otherQualifications"
                multiple
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
            />
            </div>

        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-[#104DA3] text-white px-6 py-2 rounded-full hover:bg-blue-800 font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
