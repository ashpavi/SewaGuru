import {BrowserRouter, Routes, Route} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import HomePage from "./pages/homePage";

import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import OurServices from "./pages/OurServices";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SignUp from "./pages/signUp";
import AdminPage from "./pages/adminPage";

import Testing from "./pages/testing";

import LogIn from "./pages/logIn";
import ProviderRegister from "./pages/provider/providerRegister";
import ProviderHomePage from "./pages/provider/providerHomePage";
import ProtectedRoute from "./components/protectedRoute";
import { jwtDecode } from "jwt-decode";
import ForbiddenPage from "./pages/forbidden";





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
        
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/ourServices" element={<OurServices />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/provider/providerRegister" element={<ProviderRegister />} />

        
        <Route element={<ProtectedRoute isAllowed={isProvider} redirectPath="/forbidden"/>}>
        <Route path="/provider/*" element={<ProviderHomePage />} />
        </Route>
        
        <Route path="/testing" element={<Testing />} />

        <Route path="/*" element={<HomePage />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App

