import React, { useState, useRef, useEffect } from "react";
import {
  FaBell,
  FaCog,
  FaUser,
  FaPowerOff,
  FaQuestionCircle,
} from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";

const Topbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 flex items-center justify-between px-6 z-50 bg-white shadow-lg shadow-blue-100/50 border-b border-gray-200">
      <h1 className="text-2xl font-bold flex items-center space-x-2">
  <span className="text-orange-500">HABB</span>
  <span className="text-blue-600 animate-typewriter">G</span>
  <span className="text-blue-600 animate-typewriter delay-100">o</span>
  <span className="text-blue-600 animate-typewriter delay-200">B</span>
  <span className="text-blue-600 animate-typewriter delay-300">y</span>
  <span className="text-blue-600 animate-typewriter delay-400">o</span>
  <span className="text-blue-600 animate-typewriter delay-500">n</span>
  <span className="text-blue-600 animate-typewriter delay-600">d</span>
</h1>



      <div className="flex items-center gap-5 relative">
        {/* Prepare Button */}
        <button
  className="px-4 py-1.5 bg-orange-500 text-white text-sm rounded-md shadow hover:bg-orange-600 hover:shadow-md transition-all duration-200"
  onClick={() => console.log("Open Clock In/Out Modal")}
>
  Prepare
</button>


        {/* Notification & Settings */}
        <FaBell className="text-gray-500 cursor-pointer text-lg hover:text-orange-600 transition" />
        <FaCog className="text-gray-500 cursor-pointer text-lg hover:text-orange-600 transition" />

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <img
            src="https://i.pravatar.cc/100?img=13"
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer object-cover hover:scale-105 transition-transform duration-150"
            onClick={() => setShowDropdown((prev) => !prev)}
          />

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fade-in-fast">
              {/* Profile Info */}
              <div className="flex items-center gap-3 p-4 border-b">
                <img
                  src="https://i.pravatar.cc/100?img=13"
                  className="w-12 h-12 rounded-full border border-gray-300"
                  alt="avatar"
                />
                <div>
                  <p className="font-semibold text-gray-800">Emily Smith</p>
                  <p className="text-sm text-gray-500">Manager</p>
                </div>
              </div>

              {/* Dropdown Options */}
              <DropdownItem icon={<FaUser />} text="Profile" />
              <DropdownItem icon={<BiMessageDetail />} text="Feedback" />
              <DropdownItem icon={<FaQuestionCircle />} text="Help" />

              <hr className="my-2" />

              <DropdownItem
                icon={<FaPowerOff className="text-red-500" />}
                text="Logout"
                textStyle="text-red-600 font-semibold"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const DropdownItem = ({ icon, text, textStyle = "" }) => (
  <div className="flex items-center gap-3 px-5 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition-all duration-150">
    <span className="text-lg">{icon}</span>
    <span className={`text-sm ${textStyle}`}>{text}</span>
  </div>
);

export default Topbar;
