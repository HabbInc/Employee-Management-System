import React, { useState } from "react";
import { 
  FaBars, FaTimes, FaTachometerAlt, FaBox, FaCalendarAlt, FaUsers, FaProjectDiagram, 
  FaTasks, FaCog, FaUserCircle, FaSignOutAlt, FaEnvelope, FaComments, FaBell, FaExpand 
} from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-md h-full p-5 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}>
        <button className="text-gray-900 mb-4" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <div className="flex flex-col items-center text-center">
          <FaUserCircle size={50} className="text-gray-700" />
          {isSidebarOpen && (
            <>
              <p className="mt-2 font-semibold">Employee</p>
              <span className="text-sm text-gray-500">employee@pos.com</span>
            </>
          )}
        </div>

        <nav className="mt-8">
          <ul>
            {[
              { icon: FaTachometerAlt, label: "Dashboard" },
              { icon: FaCalendarAlt, label: "Attendance" },
              { icon: FaBox, label: "My Leaves" },
              { icon: FaUsers, label: "My Team" },
              { icon: FaProjectDiagram, label: "My Projects" },
              { icon: FaTasks, label: "My Tasks" },
              { icon: FaCog, label: "Settings" },
              { icon: FaEnvelope, label: "Contacts" },
              { icon: FaComments, label: "Chat" }
            ].map((item, index) => (
              <li key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-200 rounded-md cursor-pointer">
                <item.icon className="text-gray-700" size={18} />
                {isSidebarOpen && <span>{item.label}</span>}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <nav className="bg-white shadow p-4 flex justify-between items-center px-8">
          {/* Left - Logo */}
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">HABB.</h2>
          </div>

          {/* Right - Icons & Profile */}
          <div className="flex items-center space-x-6">
            <FaExpand className="text-gray-600 cursor-pointer" size={20} />

            {/* Notification */}
            <div className="relative">
              <FaBell className="text-gray-600 cursor-pointer" size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">•</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-2" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <FaUserCircle size={28} className="text-gray-700" />
                <span className="hidden sm:inline">Ella Jones</span>
                <FiChevronDown className="text-gray-700" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-48">
                  <ul className="text-gray-900">
                    <li className="p-3 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer">
                      <FaUserCircle />
                      <span>Profile</span>
                    </li>
                    <li className="p-3 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer">
                      <FaCog />
                      <span>Settings</span>
                    </li>
                    <li className="p-3 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer">
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold">Welcome to Your POS System</h1>
          <p className="text-gray-600 mt-2">Track attendance, manage projects, and collaborate efficiently.</p>
          {/* Add more dashboard content here */}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
