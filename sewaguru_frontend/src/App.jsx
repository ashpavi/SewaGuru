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
import SGRegister from "./pages/sewaguru/sgRegister";
import SGHomePage from "./pages/sewaguru/sgHomePage";





function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
    
      <Routes >
        <Route path="/admin/*" element={<AdminPage />} />
        
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/ourServices" element={<OurServices />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/sewaguru/sgRegister" element={<SGRegister />} />
        <Route path="/sewaguru/*" element={<SGHomePage />} />
        
        
        <Route path="/testing" element={<Testing />} />

        <Route path="/*" element={<HomePage />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App

