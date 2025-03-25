import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/signIn";
import SignUp from "./pages/SignUp";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/aboutUs";
import Header from "./components/header";

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signIn" element={<SignIn/>} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/aboutUs" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App