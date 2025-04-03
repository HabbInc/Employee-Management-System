import React, { useEffect, useState, useContext } from "react";
import { EmployeeContext } from "../../context/EmployeeContext";
import { AdminContext } from "../../context/AdminContext";

import { Table, Tag, message, Input, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Card } from "antd";
import {
  FaRegCalendarPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
} from "react-icons/fa";
import axios from "axios";

const Client = () => {
  const { token, backendUrl: empUrl } = useContext(EmployeeContext);
  const { aToken, backendUrl: adminUrl } = useContext(AdminContext);

  const [form, setForm] = useState({
    fromDate: "",
    toDate: "",
    leaveType: "Sick Leave",
    reason: "",
  });
  const [leaves, setLeaves] = useState([]);
  const [adminLeaves, setAdminLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployeeLeaves = async () => {
    try {
      const res = await axios.get(`${empUrl}/employee/get-leave`, {
        headers: { token },
      });
      setLeaves(res.data.leaves || []);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const handleApplyLeave = async () => {
    if (!form.fromDate || !form.toDate || !form.reason) {
      message.warning("Please fill in all required fields");
      return;
    }
    try {
      await axios.post(
        `${empUrl}/employee/apply-leave`,
        { ...form, leaveDays: 1 },
        { headers: { token } }
      );
      message.success("Leave request submitted successfully");
      fetchEmployeeLeaves();
      setForm({ fromDate: "", toDate: "", leaveType: "Sick Leave", reason: "" });
    } catch (error) {
      console.error("Error applying leave:", error);
      message.error("Failed to submit leave request");
    }
  };

  const fetchAdminLeaves = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${adminUrl}/admin/get-all-leaves`, {
        headers: { aToken },
      });
      setAdminLeaves(res.data.leaves || []);
    } catch (error) {
      message.error("Failed to fetch leave requests");
    }
    setLoading(false);
  };

  const handleAction = async (leaveId, status) => {
    try {
      const res = await axios.put(
        `${adminUrl}/admin/update/${leaveId}`,
        {
          status,
          approvedBy: "admin" // or use adminId if you're tracking the admin user
        },
        { headers: { aToken } }
      );
      
      message.success(res.data.message);
      fetchAdminLeaves();
    } catch (err) {
      console.error("Error updating leave status:", err);
      message.error("Action failed");
    }
  };

  useEffect(() => {
    if (token) fetchEmployeeLeaves();
    if (aToken) fetchAdminLeaves();
  }, []);

  if (token) {
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
          <Button type="primary" onClick={handleApplyLeave} block>
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
              <p
                className={`font-semibold ${
                  leave.status === "Approved"
                    ? "text-green-600"
                    : leave.status === "Rejected"
                    ? "text-red-600"
                    : "text-yellow-500"
                }`}
              >
                Status: {leave.status}
              </p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (aToken) {
    const columns = [
      {
        title: "Employee",
        dataIndex: ["employeeId", "name"],
        key: "employee",
        render: (_, record) => record.employeeId?.name || "",
      },
      {
        title: "Type",
        dataIndex: "leaveType",
        key: "leaveType",
      },
      {
        title: "From",
        dataIndex: "fromDate",
        key: "fromDate",
        render: (date) => new Date(date).toLocaleDateString(),
      },
      {
        title: "To",
        dataIndex: "toDate",
        key: "toDate",
        render: (date) => new Date(date).toLocaleDateString(),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Tag color={status === "Approved" ? "green" : status === "Rejected" ? "red" : "gold"}>{status}</Tag>
        ),
      },
      {
        title: "Reason",
        dataIndex: "reason",
        key: "reason",
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) =>
          record.status === "Pending" && (
            <div className="space-x-2">
              <Button
                type="primary"
                icon={<FaCheckCircle />}
                onClick={() => handleAction(record._id, "Approved")}
              >
                Approve
              </Button>
              <Button
                danger
                icon={<FaTimesCircle />}
                onClick={() => handleAction(record._id, "Rejected")}
              >
                Reject
              </Button>
            </div>
          ),
      },
    ];

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaClipboardList className="text-purple-600" /> Admin Leave Management
        </h1>
        <Table
          dataSource={adminLeaves}
          columns={columns}
          rowKey="_id"
          loading={loading}
          scroll={{ x: "max-content" }}
        />
      </div>
    );
  }

  return <div className="p-4 text-center">Unauthorized. Please log in.</div>;
};

export default Client;