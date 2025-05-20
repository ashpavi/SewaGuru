// src/pages/client/SubscriptionDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth'; // Ensure this path is correct for your auth token

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      iconColor: '#666EE8',
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function SubscriptionDetailsModal({ plan, onClose, customerData }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // State for customer details
  const [name, setName] = useState(customerData?.name || '');
  const [contact, setContact] = useState(customerData?.contact || '');
  const [address, setAddress] = useState(customerData?.address || '');

  // UI state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Stripe specific state
  const [clientSecret, setClientSecret] = useState(null); // Stores client_secret for 3D Secure
  const [stripeSubscriptionId, setStripeSubscriptionId] = useState(null); // Stores the Stripe Sub ID returned by backend for confirmation

  // Pre-fill form if customerData is available
  useEffect(() => {
    if (customerData) {
      setName(customerData.name || '');
      setContact(customerData.contact || '');
      setAddress(customerData.address || '');
    }
  }, [customerData]);

  // Handle initial details submission, moving to payment form
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    setShowPaymentForm(true); // Move to the payment form step
  };

  // Handle payment submission (either initial payment or 3D Secure confirmation)
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!stripe || !elements) {
      setError("Stripe.js has not loaded. Please try again.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
        setError("Card details input not found. Please refresh the page.");
        setLoading(false);
        return;
    }

    try {
        const token = getToken();
        if (!token) {
            throw new Error('User not authenticated. Please log in.');
        }

        let response;
        if (clientSecret) {
            // Case 1: Client Secret exists, meaning we need to confirm 3D Secure
            console.log("Confirming card payment with client secret:", clientSecret);
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement }, // Re-use card details if needed
            });

            if (confirmError) {
                console.error('[Stripe confirm error]', confirmError);
                setError(confirmError.message);
                setLoading(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // Payment was successfully confirmed on the frontend, now inform backend
                console.log('Payment confirmed successfully on frontend. Informing backend...');
                response = await axios.post('http://localhost:5001/api/subscriptions/confirm-payment', {
                    paymentIntentId: paymentIntent.id,
                    stripeSubscriptionId: stripeSubscriptionId, // Use the stored Stripe Subscription ID
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
            } else {
                setError(`Payment confirmation failed or requires action: ${paymentIntent.status}. Please try again.`);
                setLoading(false);
                return;
            }

        } else {
            // Case 2: No client secret, this is the initial subscription creation attempt
            // Create Payment Method (does not charge, just tokenizes card)
            const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (pmError) {
                console.error('[Stripe error]', pmError);
                setError(pmError.message);
                setLoading(false);
                return;
            }
            console.log('[PaymentMethod]', paymentMethod);

            // Send payment method and subscription details to your backend
            console.log("Sending initial subscription request to backend...");
            response = await axios.post('http://localhost:5001/api/subscriptions', {
                planType: plan.planType, // Ensure this sends 'Home Essentials Plan' or 'Premium Care Plan'
                paymentMethodId: paymentMethod.id,
                customerName: name,
                customerContact: contact,
                customerAddress: address,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });
        }

        console.log('Backend response:', response.data);

        if (response.data.requiresAction && response.data.clientSecret && response.data.stripeSubscriptionId) {
            // This means the initial backend request needed 3D Secure
            setClientSecret(response.data.clientSecret);
            setStripeSubscriptionId(response.data.stripeSubscriptionId); // Store the Stripe Subscription ID
            setError("Payment requires further authentication. Please complete the verification by clicking 'Pay' again.");
            setLoading(false); // Do not set success yet, wait for user to confirm 3D Secure
            // The form will remain open, allowing the user to re-submit and trigger the 'clientSecret' flow
            return;
        }

        setSuccess(true);
        setTimeout(() => {
            onClose(); // Close modal on success
            navigate('/client/subscriptionSuccessPage'); 
        }, 1500);

    } catch (apiError) {
        console.error('Error in subscription process (API call):', apiError.response ? apiError.response.data : apiError.message);
        let errorMessage = apiError.response?.data?.message || 'Failed to process subscription. Please try again.';

        // Handle specific Stripe card errors or other backend error messages
        if (apiError.response?.data?.errorDetails && apiError.response.data.errorDetails.type === 'StripeCardError') {
            errorMessage = apiError.response.data.errorDetails.message;
        }
        // This case `apiError.response?.data?.paymentIntentStatus === 'requires_action'`
        // is handled directly by the `if (response.data.requiresAction)` block above.
        // Keeping it here might indicate a redundant check or a different error structure.
        // It's generally better if the backend's `requiresAction` response is the primary way
        // to detect 3D Secure.

        setError(errorMessage);

    } finally {
        setLoading(false);
    }
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

        {!showPaymentForm ? (
          <>
            <h3 className="text-2xl font-bold text-blue-600 mb-4 text-center">Subscription Details</h3>
            <p className="mb-2 text-gray-700">You have selected the <span className="font-semibold">{plan.name}</span> plan ({plan.price}). Please provide your details to proceed.</p>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
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
                Proceed to Payment
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-green-600 mb-4 text-center">Confirm & Pay</h3>
            <div className="border rounded-md p-4">
              <h4 className="font-semibold text-gray-700">Plan: {plan.name} ({plan.price})</h4>
              <p className="text-gray-600"><span className="font-medium">Name:</span> {name}</p>
              <p className="text-gray-600"><span className="font-medium">Contact:</span> {contact}</p>
              <p className="text-gray-600"><span className="font-medium">Address:</span> {address}</p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="p-3 border border-gray-300 rounded-md">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Card Details
                </label>
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>

              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              {success && <p className="text-green-500 text-xs italic">Payment Successful! Redirecting...</p>}

              <button
                type="submit"
                className={`w-full bg-green-500 text-white font-semibold py-2 rounded-md ${loading || !stripe ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'} transition`}
                disabled={!stripe || loading}
              >
                {loading ? 'Processing...' : `Pay ${plan.price.replace('/month', '')}`}
              </button>
              <button
                type="button"
                onClick={() => {
                    setShowPaymentForm(false);
                    setError(null); // Clear errors when going back
                    setClientSecret(null); // Clear client secret if returning to details
                    setStripeSubscriptionId(null); // Clear stripeSubscriptionId too
                }}
                className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-100 transition"
              >
                Back to Details
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionDetailsModal;