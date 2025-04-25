import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";



export default function SGRegister() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/sewaguru/sgHomePage");
  };


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    service: "",
    phone: "",
    location: "",
    lastName: "",
    nic: "",
    password: "",
    confirmPassword: "",
    address: "",
    profileImage: null,
    nicImages: [],
    gsCerts: [],
    policeCerts: [],
    extraCerts: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: [...files] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Form Submitted");
    setSubmitted(true);
  };

  const validateStep1 = () => {
    const { fullName, lastName, nic, location, service } = formData;
    return fullName && lastName && nic && location && service;
  };

  const validateStep2 = () => {
    const { phone, email, password, confirmPassword, address } = formData;
    if (!phone || !email || !password || !confirmPassword || !address) return false;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  return (
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
              name="service"
              onChange={handleChange}
              className="w-48 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400"
              value={formData.service}
            >
              <option value="">Your Service</option>
              <option value="Home Service & Repair">Home Service & Repair</option>
              <option value="Moving & Transport">Moving & Transport</option>
              <option value="Cleaning & Pest Control">Cleaning & Pest Control</option>
              <option value="Appliance Repair & Installation">Appliance Repair & Installation</option>
              <option value="Home Security & Smart Solutions">Home Security & Smart Solutions</option>
              <option value="Tree & Garden Services">Tree & Garden Services</option>

            </select>
            <button
              onClick={() => {
                if (!formData.service) {
                  toast.error("Please select your service type before continuing.");
                } else {
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
            <button type="button" onClick={() => setOpenModal(false)} className="absolute top-5 right-10 text-red-500 hover:text-red-600 text-2xl font-bold">&times;</button>
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
                    <input name="fullName" placeholder="First Name / Business" onChange={handleChange} className="border px-4 py-2 rounded-lg w-full" required />
                    <input name="lastName" placeholder="Last Name" onChange={handleChange} className="border px-4 py-2 rounded-lg w-full" required />
                  </div>
                  <input name="nic" placeholder="NIC" onChange={handleChange} className="border px-4 py-2 rounded-lg w-full" required />
                  <input name="location" placeholder="Town / City" onChange={handleChange} className="border px-4 py-2 rounded-lg w-full" required />
                </div>
                <div className="flex justify-end pt-6">
                  <button type="button" onClick={() => validateStep1() ? setStep(2) : toast.error("Please fill all the identity details") } className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md">Next</button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-3">
                  <input name="phone" placeholder="Phone Number" onChange={handleChange} className="border px-4 py-2 rounded-lg w-full" required />
                  <input name="email" placeholder="Email" type="email" onChange={handleChange} className="border px-4 py-2 rounded-lg w-full" required />
                  <input name="password" placeholder="Password" type="password" onChange={handleChange} className="border px-4 py-2 rounded-lg w-full" required />
                  <input name="confirmPassword" placeholder="Confirm Password" type="password" onChange={handleChange} className="border px-4 py-2 rounded-lg w-full" required />
                  <textarea name="address" placeholder="Full Address" rows={2} onChange={handleChange} className="border px-4 py-2 rounded-lg w-full resize-none" required />
                </div>
                <div className="flex justify-between pt-2">
                  <button type="button" onClick={() => setStep(1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg">Back</button>
                  <button type="button" onClick={() => validateStep2() ? setStep(3) : toast.error("Please fill all contact and security details") } className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md">Next</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-4">
                  {[
                    { label: "NIC (Front & Back)", name: "nicImages" },
                    { label: "Profile Image", name: "profileImage", single: true },
                    { label: "Grama Seva Certificate (GS)", name: "gsCerts" },
                    { label: "Police Clearance Certificate", name: "policeCerts" },
                    { label: "Other Certifications (Optional)", name: "extraCerts" }
                  ].map(({ label, name, single }) => (
                    <div key={name}>
                      <label className="block text-gray-700 font-medium mb-2">{label}</label>
                      <input
                        type="file"
                        name={name}
                        accept="image/*"
                        multiple={!single}
                        onChange={handleFileChange}
                        className="w-full file:py-2 file:ml-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required={!single && name !== "extraCerts"}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-6">
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
  );
}
