// ✅ EMPLOYEE CLIENT PAGE
import React, { useEffect, useState, useContext } from "react";
import { EmployeeContext } from "../../context/EmployeeContext";
import { Card, Tag } from "antd";
import { Input, Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  FaRegCalendarPlus,
  FaClipboardList,
} from "react-icons/fa";
import axios from "axios";

const Client = () => {
  const { token, backendUrl } = useContext(EmployeeContext);

  const [form, setForm] = useState({
    fromDate: "",
    toDate: "",
    leaveType: "Sick Leave",
    reason: "",
  });
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${backendUrl}/employee/get-leave`, {
        headers: { token },
      });
      setLeaves(res.data.leaves || []);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.fromDate || !form.toDate || !form.reason) {
      message.warning("Please fill all required fields");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/employee/apply-leave`,
        { ...form },
        { headers: { token } }
      );
      message.success("Leave request submitted");
      fetchLeaves();
      setForm({ fromDate: "", toDate: "", leaveType: "Sick Leave", reason: "" });
    } catch (error) {
      console.error("Error submitting leave:", error);
      message.error("Failed to apply leave");
    }
  };

  useEffect(() => {
    if (token) fetchLeaves();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaRegCalendarPlus className="text-blue-600" /> Apply for Leave
      </h1>
      <Card className="mb-6 p-4">
        <Input
          type="date"
          value={form.fromDate}
          onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
          className="mb-2"
        />
        <Input
          type="date"
          value={form.toDate}
          onChange={(e) => setForm({ ...form, toDate: e.target.value })}
          className="mb-2"
        />
        <select
          className="w-full border p-2 rounded mb-2"
          value={form.leaveType}
          onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
        >
          <option>Sick Leave</option>
          <option>Casual Leave</option>
          <option>Paid Leave</option>
          <option>Unpaid Leave</option>
          <option>Maternity Leave</option>
        </select>
        <TextArea
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          rows={3}
          className="mb-4"
        />
        <Button type="primary" onClick={handleSubmit} block>
          Submit
        </Button>
      </Card>

      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaClipboardList className="text-green-600" /> My Leave Applications
      </h2>
      <div className="space-y-4">
        {leaves.length === 0 && <p>No leave records found.</p>}
        {leaves.map((leave) => (
          <Card key={leave._id} className="p-4">
            <p>
              <strong>{leave.leaveType}</strong>: {leave.fromDate.slice(0, 10)} - {leave.toDate.slice(0, 10)}
            </p>
            <p>{leave.reason}</p>
            <p className={`font-semibold ${leave.status === "Approved" ? "text-green-600" : leave.status === "Rejected" ? "text-red-600" : "text-yellow-500"}`}>
              Status: {leave.status}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Client;