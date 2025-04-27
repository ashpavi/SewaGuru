import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center space-y-6 max-w-lg w-full text-center"
      >
        <img
          src="404.jpg"
          alt="Page Not Found"
          className="w-64 h-auto object-contain rounded-2xl shadow-md"
        />
        <h1 className="text-3xl font-bold text-red-600">404 Not Found</h1>
        <p className="text-gray-600">
          The page you are looking for does not exist. Please check the URL or go back to the homepage.
        </p>
        <Link
          to="/"
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition duration-300"
        >
          Go to Homepage
        </Link>
      </motion.div>
    </div>
  );
}