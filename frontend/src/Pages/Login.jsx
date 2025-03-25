import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { EmployeeContext } from "../context/EmployeeContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setToken } = useContext(EmployeeContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let response;
      if (state === "Admin") {
        response = await axios.post(`${backendUrl}/admin/login`, { email, password });
      } else {
        response = await axios.post(`${backendUrl}/employee/login`, { email, password });
      }

      if (!response.data || !response.data.token) {
        toast.error("Login successful, but token not received!");
        return;
      }

      if (state === "Admin") {
        localStorage.setItem("aToken", response.data.token);
        setAToken(response.data.token);
      } else {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
      }

      window.location.reload();
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-orange-50 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-orange-100"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          <span className="text-orange-500">{state}</span> Login
        </h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            placeholder="example@domain.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200"
        >
          Login
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          {state === "Admin" ? (
            <p>
              Employee Login?{" "}
              <span
                onClick={() => setState("Employee")}
                className="text-orange-500 hover:underline cursor-pointer"
              >
                Click here
              </span>
            </p>
          ) : (
            <p>
              Admin Login?{" "}
              <span
                onClick={() => setState("Admin")}
                className="text-orange-500 hover:underline cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
