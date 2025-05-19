import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51RQ3mBD5PuptLcZzK9YJTRwhb2QgjbBIWI9t0HqfQv8Q5xcOIkNs4HarcLsjqrQkAMUrl9K7edpyJMXgC1tAPggv00rX4g8Sbp'); // Replace with your test publishable key

const StripeContainer = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default StripeContainer;
