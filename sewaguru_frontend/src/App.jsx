import {BrowserRouter, Routes, Route} from "react-router-dom";

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

import AboutUsPage from "./pages/client/AboutUs";
import ContactUs from "./pages/client/contactUs";
import OurServices from "./pages/client/ourServices";
import PrivacyPolicyPage from "./pages/client/privacyPolicy";
import NotFoundPage from "./pages/404";
import ProfileDashboard from "./pages/client/profiledashboard";
import ProviderHomePage from "./pages/providerHomePage";





function App() {

  const token = localStorage.getItem("accessToken");
  const user= token? jwtDecode(token):null;
  const isAdmin = user && user.role === "admin";
  const isProvider = user && user.role === "provider";


  return (
    <BrowserRouter>
      <Toaster position="top-right" />
    
      <Routes>
        
        <Route element={<ProtectedRoute isAllowed={isAdmin} redirectPath="/forbidden"/>}>
        <Route path="/admin/*" element={<AdminPage />} />
        </Route>
        <Route path="/" element={<HomePage/>} />
        
        <Route path="/forbidden" element={<ForbiddenPage />} />
        
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/client/aboutUs" element={<AboutUsPage />} />
        <Route path="/client/contactUs" element={<ContactUs />} />
        <Route path="/client/ourServices" element={<OurServices />} />
        <Route path="/client/privacyPolicy" element={<PrivacyPolicyPage />} />
        <Route path="/client/profileDashboard" element={<ProfileDashboard />} />

        <Route path="/provider/providerRegister" element={<ProviderRegister />} />
        

        
        {/* <Route element={<ProtectedRoute isAllowed={isProvider} redirectPath="/forbidden"/>}>
        <Route path="/provider/*" element={<ProviderHomePage />} />
        </Route> */}
        <Route path="/provider/*" element={<ProviderHomePage />} />
        
        <Route path="/testing" element={<Testing />} />
        <Route path="*" element={<NotFoundPage />} />

        
      </Routes>
      
    </BrowserRouter>
  )
}

export default App

