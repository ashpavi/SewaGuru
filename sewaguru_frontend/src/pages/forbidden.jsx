import { useNavigate } from "react-router-dom";

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center space-y-6 max-w-lg w-full text-center"
      >
        <img
          src="forbidden.jpg"
          alt="Forbidden Access"
          className="w-64 h-auto object-contain rounded-2xl shadow-md"
        />
        <h1 className="text-3xl font-bold text-red-600">403 Forbidden</h1>
        <p className="text-gray-600">
          You don't have permission to access this page. Please check your credentials or try going back.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition duration-300"
        >
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
