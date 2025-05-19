import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const res = await fetch('http://localhost:5001/api/payment/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (!data.clientSecret) {
      throw new Error('No clientSecret returned from the server.');
    }

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        alert("Payment Successful!");
      }
    }
  } catch (error) {
    console.error('Error during payment:', error.message);
    setError(error.message);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay $10
      </button>
      {error && <div>{error}</div>}
      {succeeded && <p>Payment succeeded!</p>}
    </form>
  );
};

export default CheckoutForm;
