import { AiFillProduct } from "react-icons/ai";
import { BiSolidMessageDetail } from "react-icons/bi";
import { BsPersonFill } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { GrUserWorker } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { Link, Route, Routes } from "react-router-dom";

import AdminHeader from "../components/adminHeader";
import AdminDashboard from "./admin/dashboard";
import AdminRegisteredCustomers from "./admin/registeredCustomers";
import AdminServiceProviders from "./admin/serviceProviders";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <AdminHeader />

      <div className="flex flex-1 p-2.5">
        {/* Sidebar */}
        <div className="w-[300px]">
          <Link to="/admin/dashboard" className="w-[250px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><GoHomeFill className="mr-2" />Dashboard</Link>
          <Link to="/admin/services" className="w-[250px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><AiFillProduct className="mr-2" />Services</Link>
          <Link to="/admin/messages" className="w-[250px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><BiSolidMessageDetail className="mr-2" />Messages</Link>
          <Link to="/admin/users" className="w-[250px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><BsPersonFill className="mr-2" />Registered Customers</Link>
          <Link to="/admin/serviceProviders" className="w-[250px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><GrUserWorker className="mr-2" />Service Providers</Link>
          <Link to="/admin/applications" className="w-[250px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><ImProfile className="mr-2" />Service Provider Applications</Link>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg p-4 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/services" element={<h1>Services</h1>} />
            <Route path="/messages" element={<h1>Messages</h1>} />
            <Route path="/users" element={<AdminRegisteredCustomers />} />
            <Route path="/serviceProviders" element={<AdminServiceProviders />} />
            <Route path="/applications" element={<h1>Service Provider Applications</h1>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}