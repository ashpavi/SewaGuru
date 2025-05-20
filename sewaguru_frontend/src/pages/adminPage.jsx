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
import AdminVerifyProviders from "./admin/verifyProviders";
import Subscription from "./admin/subscriptions";
import AdminFeedbackDashboard from "./admin/feedback";
import AdminMessages from "./admin/conversationList";
import ConversationList from "./admin/conversationList";
import MessagesView from "./admin/messagesView";


export default function AdminPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <AdminHeader />

            <div className="flex flex-1 p-2.5">
                {/* Sidebar */}
                <div className="w-[300px]">
                    <Link to="/admin/dashboard" className="w-[280px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><GoHomeFill className="mr-2" />Dashboard</Link>
                    <Link to="/admin/subscriptions" className="w-[280px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><AiFillProduct className="mr-2" />Subscription</Link>
                    <Link to="/admin/feedback" className="w-[280px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><BiSolidMessageDetail className="mr-2" />Feedback</Link>
                    <Link to="/admin/messages" className="w-[280px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><BiSolidMessageDetail className="mr-2" />Messages</Link>
                    <Link to="/admin/users" className="w-[280px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><BsPersonFill className="mr-2" />Registered Customers</Link>
                    <Link to="/admin/serviceProviders" className="w-[280px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><GrUserWorker className="mr-2" />Service Providers</Link>
                    <Link to="/admin/applications" className="w-[280px] h-[50px] bg-white rounded-xl flex p-2 justify-center items-center m-[5px] hover:bg-gray-300"><ImProfile className="mr-2" />Service Provider Applications</Link>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-lg p-4 overflow-y-auto">
                    <Routes path="/*">
                        <Route path="/dashboard" element={<AdminDashboard />} />
                        <Route path="/subscriptions" element={<Subscription />} />
                        <Route path="/feedback" element={<AdminFeedbackDashboard />} />
                        <Route path="/messages" element={<MessagesView />} />
                        <Route path="/users" element={<AdminRegisteredCustomers />} />
                        <Route path="/serviceProviders" element={<AdminServiceProviders />} />
                        <Route path="/applications" element={<AdminVerifyProviders />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}