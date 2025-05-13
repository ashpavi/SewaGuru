import { useState } from "react";
import api from "../../api/api";
import { token } from "../../utils/auth";

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
    policeCerts: "",
    gsCerts: "",
    extraCerts: []
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "nicImages" || name === "extraCerts") {
        setFormData({ ...formData, [name]: Array.from(files) });
      } else {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Profile updated:", formData);
  //   alert("Profile updated successfully!");
  //   // You can POST this data to backend here
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();

      // Append all non-file fields
      for (const key in formData) {
        const value = formData[key];
        if (typeof value === "string") {
          form.append(key, value);
        }
      }

      // Append file fields
      if (formData.profilePic) form.append("profileImage", formData.profilePic);
      if (formData.policeCert) form.append("policeCerts", formData.policeCert);
      if (formData.gsCert) form.append("gsCerts", formData.gsCert);

      formData.nicImages.forEach((file) => {
        form.append("nicImages", file);
      });

      formData.extraCerts.forEach((file) => {
        form.append("extraCerts", file);
      });

      await api.put("/user/update", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed. See console for details.");
    }
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
              name="extraCerts"
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
