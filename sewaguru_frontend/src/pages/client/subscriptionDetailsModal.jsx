import React, { useState } from 'react';

function SubscriptionDetailsModal({ plan, onClose, onProceedToPayment }) {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [showSummary, setShowSummary] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSummary(true);
    };

    const handleConfirmPayment = () => {
        onProceedToPayment(name, contact, address);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                >
                    &times;
                </button>

                {!showSummary ? (
                    <>
                        <h3 className="text-2xl font-bold text-blue-600 mb-4 text-center">Subscription Details</h3>
                        <p className="mb-2 text-gray-700">You have selected the <span className="font-semibold">{plan.name}</span> plan ({plan.price}). Please provide your details to proceed.</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Contact (Phone/Email)"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2"
                                required
                            />
                            <textarea
                                placeholder="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2"
                                rows="2"
                                required
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
                            >
                                Proceed to Summary
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-green-600 mb-4 text-center">Subscription Summary</h3>
                        <div className="border rounded-md p-4">
                            <h4 className="font-semibold text-gray-700">Plan Details:</h4>
                            <p className="text-gray-600"><span className="font-medium">Plan Name:</span> {plan.name}</p>
                            <p className="text-gray-600"><span className="font-medium">Price:</span> {plan.price}</p>
                        </div>
                        <div className="border rounded-md p-4">
                            <h4 className="font-semibold text-gray-700">Customer Details:</h4>
                            <p className="text-gray-600"><span className="font-medium">Name:</span> {name}</p>
                            <p className="text-gray-600"><span className="font-medium">Contact:</span> {contact}</p>
                            <p className="text-gray-600"><span className="font-medium">Address:</span> {address}</p>
                        </div>
                        <button
                            onClick={handleConfirmPayment}
                            className="w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition"
                        >
                            Confirm & Subscribe
                        </button>
                        <button
                            onClick={() => setShowSummary(false)}
                            className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-100 transition"
                        >
                            Back to Edit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubscriptionDetailsModal;