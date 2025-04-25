import { useState } from "react";
import toast from "react-hot-toast";

export default function SGRegister() {
  const [step, setStep] = useState(1); 

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    service: "",
    phone: "",
    location: "",
    lastName: "",
    nic: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Form Submitted", formData);
    setOpenModal(false);
  };
  


  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen flex items-center justify-center py-12 px-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full flex flex-col md:flex-row overflow-hidden">
        {/* Left: Image */}
        <div className="md:w-1/2 bg-white flex items-center justify-center p-6 md:p-10">
          <img
            src="/SG1.jpg"
            alt="Worker"
            className="rounded-2xl w-full h-[500px] object-cover shadow-lg"
          />
        </div>

        {/* Right: Text & CTA */}
        <div className="md:w-1/2 p-8 md:p-12 space-y-6 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-gray-800 leading-tight">
            Turn Your Skills Into Income —
            <br />
            Join <span className="text-blue-600">SewaGuru</span> Today!
          </h2>
          <p className="text-gray-600 text-lg">
            Whether you’re an individual with a skill or a small business, SewaGuru connects you with the right customers. Grow your income, showcase your expertise, and let customers find you easily!
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <select
              name="service"
              onChange={handleChange}
              className="w-48 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Your Service</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Electrical">Electrical</option>
            </select>

            <button
              onClick={() => {
                setStep(1);
                setOpenModal(true);
              }}
              className="bg-green-500 hover:bg-green-600 transition px-6 py-2 rounded-lg text-white font-medium shadow-md"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>

          {/* Modal */}
          {openModal && (
            <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex items-center justify-center px-4 py-6">
              <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-2xl p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 animate-fadeIn relative"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="absolute top-5 right-10  text-red-500 hover:text-red-600 text-2xl font-bold"
                  aria-label="Close modal"
                >
                  &times;
                </button>

                {/* Step Header */}
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

                {/* Step 1: Identity */}
                {step === 1 && (
                  <>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">First Name / Business Name</label>
                          <input name="fullName" onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400" required />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">Last Name</label>
                          <input name="lastName" onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400" required />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-1">NIC</label>
                        <input name="nic" onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400" required />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Town / City</label>
                        <input name="location" onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400" required />
                      </div>
                    </div>

                    <div className="flex justify-end pt-6">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md"
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
  
                  
                  
                {/* Step 2: Contact Info */}
                {step === 2 && (
                  <>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                        <input name="phone" onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400" required />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input name="email" type="email" onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400" required />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input name="password" type="password" onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400" required />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                        <input name="confirmPassword" type="password" onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400" required />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Full Address</label>
                        <textarea name="address" rows={2} onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm resize-none focus:ring-2 focus:ring-blue-400" required />
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md"
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}

                {/* Step 3: File Upload */}
                {step === 3 && (
                  <>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          NIC (Front & Back)
                        </label>
                        <input type="file" name="nicImage" accept="image/*"
                          className="w-full file:ml-1  file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 " required/>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Grama Seva Certificate (GS)
                        </label>
                        <input type="file" name="gsCert" accept="image/*"
                          className="w-full file:ml-1 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required/>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Police Clearance Certificate
                        </label>
                        <input type="file" name="policeCert" accept="image/*"
                          className="w-full file:ml-1 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required/>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Other Certifications (Optional)
                        </label>
                        <input type="file" name="extraCert" accept="image/* "
                          className="w-full file:ml-1 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-lg shadow-md"
                      >
                        Submit
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>      
        )}
        </div>
      )}
   
  
  

