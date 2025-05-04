/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaUser, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import api from "../../api/api";
import toast from "react-hot-toast";
import Loader from "../../components/loader";

export default function ProviderProfile() {
  const [profile, setProfile] = useState(null);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [fileInputs, setFileInputs] = useState({
    profileImage: null,
    nicImages: [],
    policeCerts: null,
    gsCerts: null,
    otherCerts: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "profileImage") {
      setFileInputs({ ...fileInputs, profileImage: files[0] });
    } else if (name === "gsCerts") {
      setFileInputs({ ...fileInputs, gsCerts: files[0] });
    } else if (name === "policeCerts") {
      setFileInputs({ ...fileInputs, policeCerts: files[0] });
    } else {
      setFileInputs({ ...fileInputs, [name]: [...files] });
    }

  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const hasFileUploads =
        fileInputs.profileImage ||
        fileInputs.policeCerts ||
        fileInputs.gsCerts ||
        fileInputs.nicImages.length > 0 ||
        fileInputs.otherCerts.length > 0;

      if (!hasFileUploads) {
        const {
          email,
          role,
          _id,
          refreshToken,
          profilePicSrc,
          nicImgSrc,
          gsCertSrc,
          policeCertSrc,
          otherSrc,
          ...cleanData
        } = formData;
        await api.put("/user/update", cleanData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const updatedFormData = new FormData();

        const ignoreKeys = [
          "email",
          "role",
          "_id",
          "refreshToken",
          'profilePicSrc',
          'nicImgSrc',
          'gsCertSrc',
          'policeCertSrc',
          'otherSrc',
        ];
        for (const key in formData) {
          if (!ignoreKeys.includes(key)) {
            updatedFormData.append(key, formData[key]);
          }
        }

        if (fileInputs.profileImage)
          updatedFormData.append("profileImage", fileInputs.profileImage);
        if (fileInputs.policeCerts)
          updatedFormData.append("policeCerts", fileInputs.policeCerts);
        if (fileInputs.gsCerts)
          updatedFormData.append("gsCerts", fileInputs.gsCerts);
        fileInputs.nicImages.forEach(file =>
          updatedFormData.append("nicImages", file));
        fileInputs.otherCerts.forEach(file =>
          updatedFormData.append("extraCerts", file));

        await api.put("/user/update", updatedFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Profile updated with files");
      }

      toast.success("Profile updated successfully!");
      setEditable(false);

      const refreshed = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(refreshed.data);
      setFormData(refreshed.data);
      setFileInputs({
        profileImage: null,
        nicImages: [],
        policeCerts: null,
        gsCerts: null,
        otherCerts: [],
      });



    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const renderDocument = (label, fileUrl) => {
    const isPDF = fileUrl.toLowerCase().endsWith(".pdf");
    return (
      <div className="space-y-1" key={label}>
        <p className="text-sm text-gray-600">{label}</p>
        {isPDF ? (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer"
            className="flex justify-center items-center h-48 border rounded-lg shadow-sm bg-red-100 text-red-600 font-medium hover:bg-red-200 transition text-center">
            View PDF
          </a>
        ) : (
          <img
            src={fileUrl}
            alt={label}
            className="rounded-lg border shadow-sm w-full h-48 object-cover" />
        )}
      </div>
    );
  };

  if (loading || !profile) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        {!editable ? (
          <button
            onClick={() => setEditable(true)}
            className="bg-[#104DA3] hover:bg-blue-800 text-white px-5 py-2 rounded-full font-medium text-sm shadow-md"
          >
            Edit Profile
          </button>
        ) : (
          <div className="space-x-4">
            <button
              onClick={handleUpdate}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-medium text-sm shadow-md"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditable(false);
                setFormData(profile);
                setFileInputs({
                  profileImage: null,
                  nicImages: [],
                  policeCert: null,
                  gsCert: null,
                  otherCerts: [],
                });
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-full font-medium text-sm shadow-md"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col md:flex-row gap-8">
        <div className="flex justify-center md:w-1/3">
          <img
            src={`${profile.profilePicSrc || "/default-avatar.png"}?v=${profile.updatedAt}`}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-[#48B8E3] shadow-md"
          />

        </div>

        <div className="flex-1 space-y-4">
          <div className="text-lg font-semibold text-gray-700">
            {editable ? (
              <>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded-lg w-full"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded-lg w-full"
                />
              </>
            ) : (
              `${profile.firstName} ${profile.lastName}`
            )}
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-[#48B8E3]" /> {profile.email}
            </p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#48B8E3]" />{" "}
              {editable ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded-lg w-full"
                />
              ) : (
                profile.phone
              )}
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#48B8E3]" />{" "}
              {editable ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded-lg w-full"
                />
              ) : (
                profile.location
              )}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {editable ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded-lg w-full"
                />
              ) : (
                profile.address
              )}
            </p>
            <p>
              <span className="font-medium">Service Type:</span>{" "}
              {editable ? (
                <input
                  type="text"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded-lg w-full"
                />
              ) : (
                profile.serviceType
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Uploaded Documents</h2>

        {editable ? (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Profile Image</label>
              <input
                type="file"
                name="profileImage"
                onChange={handleFileChange}
                className="border px-4 py-2 rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">NIC Images</label>
              <input
                type="file"
                name="nicImages"
                multiple
                onChange={handleFileChange}
                className="border px-4 py-2 rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Police Certificate</label>
              <input
                type="file"
                name="policeCerts"
                onChange={handleFileChange}
                className="border px-4 py-2 rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">GS Certificate</label>
              <input
                type="file"
                name="gsCerts"
                onChange={handleFileChange}
                className="border px-4 py-2 rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Other Certifications</label>
              <input
                type="file"
                name="otherCerts"
                multiple
                onChange={handleFileChange}
                className="border px-4 py-2 rounded-lg w-full"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {profile.nicImgSrc?.map((img, i) =>
                renderDocument(`NIC ${i === 0 ? "Front" : "Back"}`, `${img}?v=${profile.updatedAt}`)
              )}
              {profile.policeCertSrc && renderDocument("Police Certificate", `${profile.policeCertSrc}?v=${profile.updatedAt}`)}
              {profile.gsCertSrc && renderDocument("GS Certificate", `${profile.gsCertSrc}?v=${profile.updatedAt}`)}
            </div>

            {profile.otherSrc?.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-800 pt-4">Other Qualifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {profile.otherSrc.map((file, index) =>
                    renderDocument(`Document ${index + 1}`, `${file}?v=${profile.updatedAt}`)
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}



