import React, { useEffect, useState, useContext } from "react";
import { Table, Avatar, Pagination, Tag } from "antd";
import { AdminContext } from "../../context/AdminContext";

const Project = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      console.log("Fetching projects..."); // Log when fetch starts
      try {
        const response = await fetch(`${backendUrl}/admin/all-projects`, {
          method: "GET",
          headers: {
            "aToken": aToken, // Custom header key as per your axios format
          },
        });

        console.log("Response Status:", response.status); // Log the response status

        const data = await response.json();
        console.log("Response Data:", data); // Log the API response data

        if (response.ok) {
          console.log("Projects fetched successfully:", data.projects); // Log the fetched projects
          setProjects(data.projects);
          setTotalItems(data.totalItems || 0);
        } else {
          console.error("Error fetching projects:", data.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchProjects();
  }, [aToken, backendUrl, currentPage]);

  const columns = [
    {
      title: "Project",
      dataIndex: "projectTitle",
      key: "projectTitle",
      width: 250,
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar src={record.image} alt="project" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Priority",
      dataIndex: "projectPriority",
      key: "projectPriority",
      width: 120,
      render: (priority) => {
        const color =
          priority === "High" ? "red" : priority === "Medium" ? "orange" : "green";
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
      width: 200,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      render: (startDate) => new Date(startDate).toLocaleDateString(),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      width: 150,
      render: (deadline) => new Date(deadline).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "workStatus",
      key: "workStatus",
      width: 120,
      render: (status) => {
        const color =
          status === "Completed"
            ? "green"
            : status === "In Progress"
            ? "blue"
            : status === "Pending"
            ? "gold"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Assigned Employees",
      key: "assignedEmployees",
      render: (text, record) => (
        <div>
          {record.assignedEmployees &&
            record.assignedEmployees.map((employee, index) => (
              <div key={index}>{employee.employeeId?.name || "No Name"}</div> // Safely access employee name
            ))}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
    
      <div style={{ overflowX: "auto" }}>
        <Table
          dataSource={projects}
          columns={columns}
          rowKey="_id"
          pagination={false}
        />
      </div>
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={10}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: "20px", textAlign: "center" }}
      />
    </div>
  );
};

export default Project;
