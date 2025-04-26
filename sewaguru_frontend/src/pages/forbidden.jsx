import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ForbiddenPage() {
    const navigate = useNavigate();
    
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-100 via-white to-red-200 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <img src="forbidden.jpg" alt="Forbidden" className="w-96 h-auto object-contain rounded-3xl shadow-2xl" />
        <button onClick={() => navigate(-1)}>
            Go Back

        </button>
      </motion.div>
    </div>
  );
}
