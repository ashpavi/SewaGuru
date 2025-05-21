import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";

function InitialRedirect() {
  const navigate = useNavigate();

  // Replace this with your actual auth/user logic
  const user = getUser();

  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user && user.role === "provider") {
      navigate("/provider/providerDashboard");
    } else {
      navigate("/home");
    }
  }, [navigate, user]);

  return null; // or a loading spinner
}

export default InitialRedirect;
