import { Link, Route, Routes } from "react-router-dom";
import { AiFillProduct } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { FaWpforms } from "react-icons/fa";

import AdminHeader from "../components/adminHeader";
import AdminDashboard from "./admin/dashboard";


export default function AdminPage(){
    return(
        <div>
        <AdminHeader/>
        <div className="w-full h-screen bg-gray-200  flex p-2.5">
            
            <div className="h-full w-[300px] ">
                <Link to="/admin/dashboard" className="w-[250px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><FaUsers className="mr-2" />Dashboard</Link>
                <Link to="/admin/services" className="w-[250px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><AiFillProduct className="mr-2" />Services</Link>
                <Link to="/admin/messages" className="w-[250px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><AiFillProduct className="mr-2" />Messages</Link>
                <Link to="/admin/users" className="w-[250px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><FaWpforms className="mr-2"/>Registered Customers</Link>
                <Link to="/admin/serviceProviders" className="w-[250px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><FaWpforms className="mr-2"/>Service Providers</Link>
                <Link to="/admin/applications" className="w-[250px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><FaWpforms className="mr-2"/>Service Provider Applications</Link>
            </div>
            <div className="h-full bg-white w-[calc(110vw-300px)] rounded-lg">
                <Routes path="/*">
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/services" element={<h1>Services</h1>} />
                    <Route path="/messages" element={<h1>Messages</h1>} />
                    <Route path="/users" element={<h1>Registered Customers</h1>} />
                    <Route path="/serviceProviders" element={<h1>Service Providers</h1>} />
                    <Route path="/applications" element={<h1>Service Provider Applications</h1>} /> 
                    
                </Routes>

            </div>
        </div>
        </div>
    )   
}

