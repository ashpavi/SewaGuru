// BookingModal.jsx
import React, { useState, useEffect } from 'react';

export default function BookingModal({ category, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    propertyType: 'Home',
    subService: '',
    urgency: 'Normal',
    complexity: 'Simple',
    date: '',
    timeSlot: 'Morning',
    description: '',
    image: null,
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md  flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#104DA3]">Book Appointment for {category}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full p-3 border rounded" required />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full p-3 border rounded" required />
              <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Service Address" className="w-full p-3 border rounded" rows={2} required></textarea>
              <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full p-3 border rounded">
                <option>Home</option>
                <option>Office</option>
                <option>Other</option>
              </select>
              <input type="text" name="subService" value={formData.subService} onChange={handleChange} placeholder="Sub-Service (optional)" className="w-full p-3 border rounded" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full p-3 border rounded">
                <option>Normal</option>
                <option>Urgent</option>
                <option>Emergency</option>
              </select>
              <select name="complexity" value={formData.complexity} onChange={handleChange} className="w-full p-3 border rounded">
                <option>Simple</option>
                <option>Moderate</option>
                <option>Complex</option>
              </select>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-3 border rounded" required />
              <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="w-full p-3 border rounded">
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the issue (optional)" className="w-full p-3 border rounded" rows={3}></textarea>
              <input type="file" name="image" onChange={handleChange} className="w-full" accept="image/*" />
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-300 rounded">Previous</button>
            )}
            {step < 2 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="ml-auto px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">Next</button>
            ) : (
              <button type="submit" className="ml-auto px-4 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600">Submit Booking</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
