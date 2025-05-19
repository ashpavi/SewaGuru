import React, { useState, useEffect } from 'react';
import api from '../../api/api'; // Import your configured Axios instance
import { toast } from 'react-hot-toast';
import { FaStar, FaExclamationTriangle } from 'react-icons/fa';
import { getToken } from '../../utils/auth'; // Import your getToken utility

const AdminFeedbackDashboard = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllFeedback = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await api.get('/feedback/allFeedback', { 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeedbackList(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch feedback.');
        toast.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAllFeedback();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
        <p className="text-gray-600">Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="text-red-500 text-xl mb-4">
          <FaExclamationTriangle className="inline-block mr-2" />
          Error: {error}
        </div>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  const complaints = feedbackList.filter(feedback => feedback.category === 'Complaint');
  const reviews = feedbackList.filter(feedback => feedback.category === 'Rate Us/Feedback');

  return (
    <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Admin Feedback Dashboard
      </h2>

      {/* Complaints Section */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
          <FaExclamationTriangle className="inline-block mr-2" />
          Complaints ({complaints.length})
        </h3>
        {complaints.length > 0 ? (
          <ul className="space-y-4">
            {complaints.map((complaint) => (
              <li key={complaint._id} className="bg-red-50 p-4 rounded-md border border-red-200">
                <p className="text-gray-700">
                  <strong>Name:</strong> {complaint.name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {complaint.email}
                </p>
                <p className="text-red-700 italic">
                  <strong>Complaint Against:</strong> {complaint.complainAgainst || 'N/A'}
                </p>
                <p className="text-gray-700">
                  <strong>Message:</strong> {complaint.message}
                </p>
                <p className="text-sm text-gray-500">
                  Submitted At: {new Date(complaint.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No complaints received.</p>
        )}
      </section>

      {/* Reviews Section */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-yellow-600 mb-4 flex items-center">
          <FaStar className="inline-block mr-2" />
          Reviews ({reviews.length})
        </h3>
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review._id} className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <p className="text-gray-700">
                  <strong>Name:</strong> {review.name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {review.email}
                </p>
                <div className="flex items-center mb-1">
                  <strong>Rating:</strong>
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`ml-1 text-yellow-400 ${index < review.rating ? '' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700">
                  <strong>Feedback:</strong> {review.message}
                </p>
                <p className="text-sm text-gray-500">
                  Submitted At: {new Date(review.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No reviews received.</p>
        )}
      </section>
    </div>
  );
};

export default AdminFeedbackDashboard;