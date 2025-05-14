import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster } from "react-hot-toast";


import AdminPage from "./pages/adminPage";
import SignUp from "./pages/signUp";

import HomePage from "./pages/homePage";
import Testing from "./pages/testing";

import ProtectedRoute from "./components/protectedRoute";
import ForbiddenPage from "./pages/forbidden";
import LogIn from "./pages/logIn";
import ProviderRegister from "./pages/provider/providerRegister";

import { GoogleOAuthProvider } from "@react-oauth/google";
import NotFoundPage from "./pages/404";
import AboutUsPage from "./pages/client/AboutUs";
import ContactUs from "./pages/client/contactUs";
import OurServices from "./pages/client/ourServices";
import PrivacyPolicyPage from "./pages/client/privacyPolicy";
import ProfileDashboard from "./pages/client/profiledashboard";
import SubscriptionPlans from "./pages/client/subscriptionPlans";
import ProviderHomePage from "./pages/providerHomePage";
import { isAdmin, isProvider } from "./utils/auth";

function App() {
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
