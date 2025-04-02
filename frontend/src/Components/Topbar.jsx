import React, { useState, useRef, useEffect, useContext } from "react";
import { FaBell, FaCog, FaUser, FaPowerOff, FaQuestionCircle } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { AdminContext } from "../context/AdminContext";
import { EmployeeContext } from "../context/EmployeeContext";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const Topbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [attendanceState, setAttendanceState] = useState("none");
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef();

  const { aToken } = useContext(AdminContext);
  const { token } = useContext(EmployeeContext);

  // ✅ Fetch attendance status
  useEffect(() => {
    if (token) {
      axios
        .get(`${BASE_URL}/api/attendance/status`, {
          headers: { token },
        })
        .then((res) => setAttendanceState(res.data.state))
        .catch((err) => console.error("Status fetch error:", err));
    }
  }, [token]);

  // ✅ Handle clock actions
  const handleAction = async (action) => {
    const endpoint =
      action === "clockin"
        ? `${BASE_URL}/api/attendance/clock-in`
        : action === "clockout"
        ? `${BASE_URL}/api/attendance/clock-out`
        : action === "startBreak"
        ? `${BASE_URL}/api/attendance/start-break`
        : `${BASE_URL}/api/attendance/end-break`;

    try {
      await axios.post(endpoint, {}, {
        headers: { token },
      });

      if (action === "clockin") setAttendanceState("clocked-in");
      else if (action === "clockout") setAttendanceState("none");
      else if (action === "startBreak") setAttendanceState("on-break");
      else if (action === "endBreak") setAttendanceState("clocked-in");

      setShowModal(false);
    } catch (err) {
      console.error("Action failed:", err);
      alert("Something went wrong");
    }
  };

  // ✅ Close dropdown on outside click
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
    <header className="fixed top-0 left-64 right-0 h-16 flex items-center justify-between px-6 z-50 bg-white shadow-lg border-b">
      <h1 className="text-2xl font-bold flex items-center space-x-2">
        <span className="text-orange-500">HABB</span>
        {"GoBeyond".split("").map((char, i) => (
          <span key={i} className={`text-blue-600 animate-typewriter delay-${i * 100}`}>
            {char}
          </span>
        ))}
      </h1>

      <div className="flex items-center gap-5 relative">
        {aToken && (
          <button className="px-4 py-1.5 bg-orange-500 text-white text-sm rounded-md shadow hover:bg-orange-600">
            Admin Panel
          </button>
        )}

        {token && (
          <>
            <button
              onClick={() => setShowModal((prev) => !prev)}
              className={`px-4 py-1.5 text-white text-sm rounded-md shadow transition-all duration-200 ${
                attendanceState === "none"
                  ? "bg-orange-500 hover:bg-orange-600"
                  : attendanceState === "clocked-in"
                  ? "bg-green-600"
                  : "bg-yellow-500"
              }`}
            >
              {attendanceState === "none"
                ? "Clock In"
                : attendanceState === "on-break"
                ? "On Break"
                : "Clocked In"}
            </button>

            {showModal && (
              <div className="absolute top-12 right-28 w-64 bg-white rounded-xl shadow-xl border z-50">
                <div className="p-4 space-y-2">
                  <h2 className="text-md font-semibold text-gray-800">Attendance Options</h2>

                  {attendanceState === "none" && (
                    <button
                      onClick={() => handleAction("clockin")}
                      className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                    >
                      Clock In
                    </button>
                  )}

                  {attendanceState === "clocked-in" && (
                    <>
                      <button
                        onClick={() => handleAction("startBreak")}
                        className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                      >
                        Start Break
                      </button>
                      <button
                        onClick={() => handleAction("clockout")}
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                      >
                        Clock Out
                      </button>
                    </>
                  )}

                  {attendanceState === "on-break" && (
                    <>
                      <button
                        onClick={() => handleAction("endBreak")}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                      >
                        End Break
                      </button>
                      <button
                        onClick={() => handleAction("clockout")}
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                      >
                        Clock Out
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full text-gray-500 hover:text-black text-sm mt-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <FaBell className="text-gray-500 cursor-pointer text-lg hover:text-orange-600" />
        <FaCog className="text-gray-500 cursor-pointer text-lg hover:text-orange-600" />

        <div className="relative" ref={dropdownRef}>
          <img
            src="https://i.pravatar.cc/100?img=13"
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer object-cover hover:scale-105"
            onClick={() => setShowDropdown((prev) => !prev)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-64 bg-white border rounded-xl shadow-xl z-50">
              <div className="flex items-center gap-3 p-4 border-b">
                <img src="https://i.pravatar.cc/100?img=13" className="w-12 h-12 rounded-full border" alt="avatar" />
                <div>
                  <p className="font-semibold text-gray-800">{aToken ? "Admin Name" : "Employee Name"}</p>
                  <p className="text-sm text-gray-500">{aToken ? "Administrator" : "Employee"}</p>
                </div>
              </div>
              <DropdownItem icon={<FaUser />} text="Profile" />
              <DropdownItem icon={<BiMessageDetail />} text="Feedback" />
              <DropdownItem icon={<FaQuestionCircle />} text="Help" />
              <hr className="my-2" />
              <DropdownItem icon={<FaPowerOff className="text-red-500" />} text="Logout" textStyle="text-red-600 font-semibold" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const DropdownItem = ({ icon, text, textStyle = "" }) => (
  <div className="flex items-center gap-3 px-5 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
    <span className="text-lg">{icon}</span>
    <span className={`text-sm ${textStyle}`}>{text}</span>
  </div>
);

export default Topbar;
