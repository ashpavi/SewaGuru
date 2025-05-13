import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/signUp";
import AdminPage from "./pages/adminPage";
import Testing from "./pages/testing";
import HomePage from "./pages/homePage";
import LogIn from "./pages/logIn";
import ProviderRegister from "./pages/provider/providerRegister";
import ProtectedRoute from "./components/protectedRoute";
import { jwtDecode } from "jwt-decode";
import ForbiddenPage from "./pages/forbidden";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AboutUsPage from "./pages/client/AboutUs";
import ContactUs from "./pages/client/contactUs";
import OurServices from "./pages/client/ourServices";
import PrivacyPolicyPage from "./pages/client/privacyPolicy";
import NotFoundPage from "./pages/404";
import ProfileDashboard from "./pages/client/profiledashboard";
import ProviderHomePage from "./pages/providerHomePage";
import SubscriptionPlans from "./pages/client/subscriptionPlans";

function App() {
  const token = localStorage.getItem("accessToken");
  console.log("Retrieved Token:", token);

  let user = null;
  let isAdmin = false;
  let isProvider = false;

  if (token) {
    try {
      user = jwtDecode(token);
      console.log("Decoded User:", user);

      // Simple and correct role check
      isAdmin = user?.role === "admin";
      isProvider = user?.role === "provider";

      console.log("isAdmin:", isAdmin, "isProvider:", isProvider);
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/client/aboutUs" element={<AboutUsPage />} />
          <Route path="/client/contactUs" element={<ContactUs />} />
          <Route path="/client/ourServices" element={<OurServices />} />
          <Route path="/client/subscriptionPlans" element={<SubscriptionPlans />} />
          <Route path="/client/privacyPolicy" element={<PrivacyPolicyPage />} />
          <Route path="/client/profileDashboard" element={<ProfileDashboard />} />
          <Route path="/provider/providerRegister" element={<ProviderRegister />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="*" element={<NotFoundPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute isAllowed={isAdmin} redirectPath="/forbidden">
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Provider Routes */}
          <Route
            path="/provider/*"
            element={
              <ProtectedRoute isAllowed={isProvider} redirectPath="/forbidden">
                <ProviderHomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
