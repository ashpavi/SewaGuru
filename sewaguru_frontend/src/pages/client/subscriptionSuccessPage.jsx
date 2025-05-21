
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header'; 
import Footer from '../../components/Footer'; 

function SubscriptionSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center py-10 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center max-w-2xl mx-auto">
          <svg
            className="w-24 h-24 text-green-500 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Subscription Successful!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for subscribing to our service. Your plan is now active!
          </p>
          <p className="text-gray-500 text-sm mb-8">
            You will receive a confirmation email shortly with your subscription details.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            
            <Link
              to="/home"
              className="border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-sm"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SubscriptionSuccessPage;