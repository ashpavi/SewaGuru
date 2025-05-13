import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster } from "react-hot-toast";


import AdminPage from "./pages/adminPage";
import SignUp from "./pages/signUp";

import HomePage from "./pages/homePage";
import Testing from "./pages/testing";

import LogIn from "./pages/logIn";
import ProviderRegister from "./pages/provider/providerRegister";

import ProtectedRoute from "./components/protectedRoute";
import ForbiddenPage from "./pages/forbidden";

import NotFoundPage from "./pages/404";
import AboutUsPage from "./pages/client/AboutUs";
import ContactUs from "./pages/client/contactUs";
import OurServices from "./pages/client/ourServices";
import PrivacyPolicyPage from "./pages/client/privacyPolicy";
import ProfileDashboard from "./pages/client/profiledashboard";
import SubscriptionPlans from "./pages/client/subscriptionPlans";
import ProviderHomePage from "./pages/providerHomePage";
import { isAdmin, isProvider, isTokenExpired } from "./utils/auth";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route element={<ProtectedRoute isAllowed={isAdmin} redirectPath="/forbidden" />}>
          <Route path="/admin/*" element={<AdminPage />} />
        </Route>
        <Route element={<ProtectedRoute isAllowed={!isTokenExpired} redirectPath="/logIn" />}>
          <Route path="/" element={<HomePage />} />
        </Route>


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

        <Route element={<ProtectedRoute isAllowed={isProvider} redirectPath="/forbidden" />}>
          <Route path="/provider/*" element={<ProviderHomePage />} />
        </Route>


        <Route path="/testing" element={<Testing />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

