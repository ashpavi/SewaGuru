import {BrowserRouter, Routes, Route} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import HomePage from "./pages/homepage";
import SignIn from "./pages/SignIn";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import OurServices from "./pages/OurServices";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SignUp from "./pages/SignUp";
import AdminPage from "./pages/adminPage";




function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
    
      <Routes >
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/*" element={<HomePage />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/ourServices" element={<OurServices />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App

