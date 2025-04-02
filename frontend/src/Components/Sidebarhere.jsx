import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaUserFriends, FaCalendarCheck, FaBriefcase } from "react-icons/fa";
import { MdDashboard, MdPeople, MdOutlineHolidayVillage } from "react-icons/md";
import { AdminContext } from "../context/AdminContext";
import { EmployeeContext } from "../context/EmployeeContext";

const Sidebarhere = () => {
  const { aToken } = useContext(AdminContext);
  const { token } = useContext(EmployeeContext);

  const adminNavItems = [
    { icon: <MdDashboard />, label: "Dashboard", url: "/admin/dashboard" },
    { icon: <FaUserFriends />, label: "Employees", url: "/admin/employees" },
    { icon: <FaBriefcase />, label: "Projects", url: "/admin/projects" },
    { icon: <FaCalendarCheck />, label: "Attendance", url: "/admin/attendance" },
    { icon: <MdPeople />, label: "Clients", url: "/admin/clients" },
    { icon: <MdOutlineHolidayVillage />, label: "Salary", url: "/admin/salary" },
  ];

  const employeeNavItems = [
    { icon: <MdDashboard />, label: "Dashboard", url: "/employee/dashboard" },
    { icon: <FaUserFriends />, label: "Team", url: "/employee/team" },
    { icon: <FaBriefcase />, label: "Tasks", url: "/employee/tasks" },
    { icon: <FaCalendarCheck />, label: "Attendance", url: "/employee/attendance" },
    { icon: <MdPeople />, label: "Clients", url: "/employee/clients" },
    { icon: <MdOutlineHolidayVillage />, label: "Salary", url: "/employee/salary" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg p-4 fixed h-screen">
      {aToken && (
        <>
          <div className="text-center mt-6">
            <img
              src="https://i.pravatar.cc/100"
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto"
            />
            <h2 className="mt-2 font-bold">Emily Smith</h2>
            <p className="text-sm text-gray-500">Manager</p>
          </div>
          <nav className="mt-10 space-y-2">
            {adminNavItems.map((item, i) => (
              <Link
                key={i}
                to={item.url}
                className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </>
      )}

      {token && (
        <>
          <div className="text-center mt-6">
            <img
              src="https://i.pravatar.cc/100"
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto"
            />
            <h2 className="mt-2 font-bold">Kajanthan</h2>
            <p className="text-sm text-gray-500">Employee</p>
          </div>
          <nav className="mt-10 space-y-2">
            {employeeNavItems.map((item, i) => (
              <Link
                key={i}
                to={item.url}
                className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </>
      )}
    </aside>
  );
};

export default Sidebarhere;
