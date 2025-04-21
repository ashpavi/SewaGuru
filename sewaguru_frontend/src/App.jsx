import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/aboutUs";
import Header from "./components/header";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import OurServices from "./pages/OurServices";
import SignIn from "./pages/SignIn";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signIn" element={<SignIn/>} />
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

