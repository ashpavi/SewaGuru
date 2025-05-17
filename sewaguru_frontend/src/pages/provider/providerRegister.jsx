import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSearchLocation } from "react-icons/fa";
import { IoInformationCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Footer from "../../components/Footer";
import Header from "../../components/header";
import Loader from "../../components/loader";
import { getToken } from "../../utils/auth";




export default function ProviderRegister() {
  const handleLogout = async () => {
    const token = getToken();
    try {
      if (token) {
        await api.post("/user/logout", null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      navigate("/logIn");

    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/logIn");
    }
  };

  const handleRegister = async () => {
    const token = getToken();
    let user = null;

    if (token) {
      try {
        user = jwtDecode(token);
      } catch (e) {
        console.error("Invalid token:", e);
      }
    }

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", "provider");
    formDataToSend.append("nic", formData.nic);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("serviceType", formData.serviceType);
    formDataToSend.append("gsCerts", formData.gsCerts);
    formDataToSend.append("policeCerts", formData.policeCerts);
    formDataToSend.append("profileImage", formData.profileImage);
    Array.from(formData.nicImages).forEach(file =>
      formDataToSend.append("nicImages", file)
    );
    Array.from(formData.extraCerts).forEach(file =>
      formDataToSend.append("extraCerts", file)
    );
    setLoading(true);

    try {
      if (user?.role === "customer") {
        await api.post("/user/upgrade", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await api.post("/user/register", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success("Registration successful!");


    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };


  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerData = async () => {
      const token = getToken();
      if (!token) return;
      setLoading(true);

      try {
        const decoded = jwtDecode(token);
        setUser(decoded);

        // If customer, fetch their full profile
        if (decoded.role === "customer") {
          const res = await api.get("/user/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = res.data;

          // Set form data with backend-provided details
          setFormData((prev) => ({
            ...prev,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            nic: data.nic || "",
            location: data.location || "",
          }));
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        toast.error("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (openModal) {
      fetchCustomerData();
    }
  }, [openModal]);



  const handleGetStarted = () => {
    handleLogout()
  };

  const closeModel = () => {
    setOpenModal(false)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      serviceType: "",
      phone: "",
      location: "",
      nic: "",
      password: "",
      confirmPassword: "",
      address: "",
      profileImage: null,
      nicImages: [],
      gsCerts: null,
      policeCerts: null,
      extraCerts: []
    })
  }


  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    serviceType: "",
    phone: "",
    location: "",
    lastName: "",
    nic: "",
    password: "",
    confirmPassword: "",
    address: "",
    profileImage: null,
    nicImages: [],
    gsCerts: null,
    policeCerts: null,
    extraCerts: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
    } else if (name === "gsCerts") {
      setFormData({ ...formData, gsCerts: files[0] });
    } else if (name === "policeCerts") {
      setFormData({ ...formData, policeCerts: files[0] });
    } else {
      setFormData({ ...formData, [name]: [...files] });
    }
  };

  const handleSubmit = (e) => {

    e.preventDefault();
    handleRegister()
    toast.success("Form Submitted");
    setSubmitted(true);
  };

  const validateStep1 = () => {
    const { firstName, lastName, nic, location, serviceType } = formData;
    return firstName && lastName && nic && location && serviceType;
  };

  const validateStep2 = () => {
    const { phone, email, password, confirmPassword, address } = formData;

    if (!phone || !email || !address) return false;

    if (user?.role !== "customer") {
      if (!password || !confirmPassword) return false;
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
    }

    return true;
  };




  return loading ? (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader />
      <p className="text-gray-500 mt-4">Please wait while we process your request...</p>
    </div>
  ) : (
    <>
      <Header />
      <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen flex items-center justify-center py-12 px-6">
        <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full flex flex-col md:flex-row overflow-hidden">
          <div className="md:w-1/2 bg-white flex items-center justify-center p-6 md:p-10">
            <img src="/SG1.jpg" alt="Worker" className="rounded-2xl w-full h-[500px] object-cover shadow-lg" />
          </div>
          <div className="md:w-1/2 p-8 md:p-12 space-y-6 flex flex-col justify-center">
            <h2 className="text-4xl font-extrabold text-gray-800 leading-tight">
              Turn Your Skills Into Income —<br />
              Join <span className="text-blue-600">SewaGuru</span> Today!
            </h2>
            <p className="text-gray-600 text-lg">
              Whether you’re an individual with a skill or a small business, SewaGuru connects you with the right customers.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <select
                name="serviceType"
                onChange={handleChange}
                className="w-48 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400"
                value={formData.serviceType}
              >

                <option value="">Your Service</option>
                <option value="home_service_repairs">Home Service & Repair</option>
                <option value="moving_transport">Moving & Transport</option>
                <option value="cleaning_pest_control">Cleaning & Pest Control</option>
                <option value="appliance_repair_installation">Appliance Repair & Installation</option>
                <option value="home_security_solutions">Home Security & Smart Solutions</option>
                <option value="tree_garden_services">Tree & Garden Services</option>

              </select>
              <button
                onClick={() => {
                  if (!formData.serviceType) {
                    toast.error("Please select your service type before continuing.");
                  } else {
                    if (user && user.role === "customer") {
                      toast("You're upgrading your account to become a provider");
                    }
                    setStep(1);
                    setSubmitted(false);
                    setOpenModal(true);
                  }
                }}

                className="bg-green-500 hover:bg-green-600 transition px-6 py-2 rounded-lg text-white font-medium shadow-md"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>

        {openModal && !submitted && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex items-center justify-center px-4 py-6">
            <form onSubmit={handleSubmit} className="bg-white w-full max-w-2xl p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 animate-fadeIn relative">
              <button type="button" onClick={() => closeModel()} className="absolute top-5 right-10 text-red-500 hover:text-red-600 text-2xl font-bold">&times;</button>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-800">
                  {step === 1 && "Let's Get Started"}
                  {step === 2 && "Contact & Security Info"}
                  {step === 3 && "Upload Documents"}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {step === 1 && "Enter your identity information."}
                  {step === 2 && "Provide account and contact details."}
                  {step === 3 && "Upload required identification and certifications."}
                </p>
              </div>

              {step === 1 && (
                <>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        name="firstName"
                        value={formData.firstName}
                        placeholder="First Name / Business"
                        onChange={handleChange}
                        className="border px-4 py-2 rounded-lg w-full"
                        readOnly={user?.role === "customer"}
                        required
                      />
                      <input
                        name="lastName"
                        value={formData.lastName}
                        placeholder="Last Name"
                        onChange={handleChange}
                        className="border px-4 py-2 rounded-lg w-full"
                        readOnly={user?.role === "customer"}
                        required
                      />
                    </div>
                    <input
                      name="nic"
                      placeholder="NIC"
                      value={formData.nic}
                      onChange={handleChange}
                      className="border px-4 py-2 rounded-lg w-full"

                      required
                    />

                    {/* Postal Code Input + Button in same line */}
                    <div className="grid grid-cols-5 gap-4">
                      <div className="col-span-4">
                        <input
                          name="location"
                          placeholder="Postal Code"
                          value={formData.location}
                          onChange={handleChange}
                          className="border px-4 py-2 rounded-lg w-full"

                          required
                        />
                      </div>
                      <div className="col-span-1 flex justify-center items-center">

                        <a

                          href="https://www.geonames.org/postalcode-search.html?q=&country=lk"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 hover:bg-green-600 text-white flex justify-center items-center gap-1 text-xs px-3 py-2 rounded-lg shadow-md text-center"
                        >
                          <FaSearchLocation />
                          Find
                        </a>
                      </div>
                    </div>

                  </div>
                  <div className="flex justify-end pt-6">
                    <button
                      type="button"
                      onClick={() =>
                        validateStep1()
                          ? setStep(2)
                          : toast.error("Please fill all the identity details")
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}


              {step === 2 && (
                <>
                  <div className="space-y-3">
                    <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="border px-4 py-2 rounded-lg w-full" readOnly={user?.role === "customer"} required />
                    <textarea name="address" placeholder="Full Address" rows={2} value={formData.address} onChange={handleChange} className="border px-4 py-2 rounded-lg w-full resize-none" required />
                    <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} className="border px-4 py-2 rounded-lg w-full" readOnly={user?.role === "customer"} required />
                    {user?.role !== "customer" && (
                      <>
                        <input
                          name="password"
                          placeholder="Password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="border px-4 py-2 rounded-lg w-full"
                          required
                        />
                        <input
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="border px-4 py-2 rounded-lg w-full"
                          required
                        />
                      </>
                    )}


                    {/* <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} className="border px-4 py-2 rounded-lg w-full" required />
                  <input name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} type="password" onChange={handleChange} className="border px-4 py-2 rounded-lg w-full" required /> */}
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setStep(1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg">Back</button>
                    <button type="button" onClick={() => validateStep2() ? setStep(3) : toast.error("Please fill all contact and security details")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md">Next</button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-2">
                    {[
                      { label: "NIC (Front & Back)", name: "nicImages", info: "Upload clear images of both sides of your NIC to verify identity." },
                      { label: "Profile Image", name: "profileImage", single: true, info: "Upload a professional profile picture." },
                      { label: "Grama Seva Certificate (GS)", name: "gsCerts", single: true, info: "Upload a scanned copy of your GS certificate to verify proof of residence." },
                      { label: "Police Clearance Certificate", name: "policeCerts", single: true, info: "Upload a valid police clearance certificate to ensure a clean background." },
                      { label: "Other Certifications (Optional)", name: "extraCerts", info: "Upload any other certificates to showcase your expertise." }
                    ].map(({ label, name, single, info }) => (
                      <div key={name}>
                        <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
                          {label}
                          <div className="relative group">
                            <IoInformationCircleSharp className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                              {info}
                            </div>
                          </div>
                        </label>
                        <div className="flex items-start gap-2">
                          <input
                            type="file"
                            name={name}
                            accept="image/*,application/pdf"

                            multiple={!single}
                            onChange={handleFileChange}
                            className="flex-shrink-0 w-full max-w-xs text-transparent file:text-blue-700 file:bg-blue-50 hover:file:bg-blue-100 file:ml-1 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold cursor-pointer" required={!single && name !== "extraCerts"}

                          />
                          {formData[name] && (
                            <div className="max-h-24 overflow-y-auto rounded-md border border-gray-200 p-2 bg-gray-50 w-full mt-1">
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {single ? (
                                  <li className="truncate">{formData[name].name}</li>
                                ) : (
                                  formData[name].map((file, idx) => (
                                    <li key={idx} className="truncate">{file.name}</li>
                                  ))
                                )}
                              </ul>
                            </div>
                          )}

                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-1">
                    <button type="button" onClick={() => setStep(2)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg">Back</button>
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md">Submit</button>
                  </div>
                </>
              )}
            </form>
          </div>
        )}

        {submitted && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 py-6">
            <div className="bg-white w-full max-w-5xl p-12 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-10 animate-fadeIn">
              <div className="flex-1">
                <img src="/SG2.jpg" alt="Worker" className="w-full h-auto max-w-sm mx-auto rounded-3xl shadow-md border-4 border-blue-100" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                  All Set!<br />
                  Welcome to <span className="text-blue-600">SewaGuru Family</span>
                </h2>
                <p className="text-gray-600 mb-6">You're now ready to grow your business and get hired by customers near you.</p>
                <button
                  onClick={handleGetStarted}
                  className="inline-block bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 px-8 py-3 rounded-xl text-white font-semibold shadow-lg text-center"
                >
                  Let's get started
                </button>

              </div>

            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
