import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./Components/Sidebarhere";
import Topbar from "./components/Topbar";
import Login from "./Pages/Login";

import { AdminContext } from "./context/AdminContext";
import { EmployeeContext } from "./context/EmployeeContext";

import Project from "./Pages/Admin/Project";

import AdminClient from "./Pages/Admin/Client";
import EmployeeClient from "./Pages/Employee/Client"; 

import SalaryManagement from "./Pages/Admin/SalaryManagement";


const App = () => {
  const { aToken } = useContext(AdminContext);
  const { token } = useContext(EmployeeContext);

  console.log("Admin Token:", aToken);
  console.log("Employee Token:", token);

  return aToken || token ? (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer />
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 overflow-auto p-4 mt-16 ml-64">
          <Routes>
            {aToken && (
              <>
                <Route path="/" element={<Project />} />
                <Route path="/admin/projects" element={<Project />} />

                <Route path="/admin/clients" element={<AdminClient />} />
              </>
            )}

            {token && (
              <>
                <Route path="/employee/clients" element={<EmployeeClient />} /> 

                <Route path="/admin/salary" element={<SalaryManagement />} />

              </>
            )}

            <Route path="/" element={<Login />} />
          </Routes>
        </main>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
