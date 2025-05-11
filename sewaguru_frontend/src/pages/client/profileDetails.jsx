/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "../../api/api";
import toast from "react-hot-toast";
import Loader from "../../components/loader";

export default function ProfileDetails() {
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  const getUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/user", {
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
      setFormData(response.data); 
      console.log("User data fetched:", response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const {email,role, ...rest} = formData; // exclude email from formData

      const response = await api.put("/user/update", rest, { // use rest instead of formData
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Profile updated successfully!");
      setEditable(false);
      getUserData(); // refresh data
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (loading || !userData) {
    return <Loader/>
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md text-gray-700">
      <h2 className="text-2xl font-bold text-[#104DA3] mb-6 text-center">Profile Details</h2>

      <form className="space-y-4">
        {[
          { label: "First Name", name: "firstName" },
          { label: "Last Name", name: "lastName" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone", name: "phone" },
          { label: "Location", name: "location" },
          { label: "NIC", name: "nic" },
          { label: "Address", name: "address" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block mb-1 font-medium">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              disabled={name=="email" || !editable}
              className={`w-full px-4 py-2 border rounded-lg shadow-sm ${
                name != "email" && editable
                  ? "bg-white border-blue-400"
                  : "bg-gray-100 border-gray-300"
              }`}
            />
          </div>
        ))}
      </form>

      <div className="mt-6 text-center space-x-4">
        {!editable ? (
          <button
            onClick={() => setEditable(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow-md transition"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-md transition"
            >
              Update
            </button>
            <button
              onClick={() => {
                setEditable(false);
                setFormData(userData); // reset changes
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-full shadow-md transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
