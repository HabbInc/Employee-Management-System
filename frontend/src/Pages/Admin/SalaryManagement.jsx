import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Tag, Tooltip, Pagination } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom"; 
import CreateSalaryModal from "../../Components/CreateSalary";
import { message } from 'antd';

const Salary = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const [salaries, setSalaries] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false); 

  const navigate = useNavigate(); 

  // Fetch salaries data from the API
  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await fetch(`${backendUrl}/admin/all-salaries`, {
          method: "GET",
          headers: {
            "aToken": aToken,
          },
        });

        const data = await response.json();
        console.log(data); 

        if (response.ok) {
          setSalaries(data || []);  
          setTotalItems(data.length || 0);  
        } else {
          console.error("Error fetching salaries:", data.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchSalaries();
  }, [aToken, backendUrl, currentPage]);

  const handleDelete = async (id) => {
    try {
      // Send the DELETE request to the backend using fetch
      const response = await fetch(`${backendUrl}/admin/deleteSalary/${id}`, {
        method: 'DELETE',
        headers: {
            "aToken": aToken,
          },
      });
  
      // Check if the response was successful
      if (response.ok) {
        // Optionally, show a success message or refresh the list
        alert("Salary record deleted successfully!");
        // You may want to refresh the data after deletion, for example:
        // fetchData();
      } else {
        throw new Error("Failed to delete salary record.");
      }
    } catch (error) {
      // Handle error if the request fails
      console.error("Error deleting salary:", error);
      alert("Failed to delete salary record.");
    }
  };
  

  const handleProjectCreated = async () => {
    try {
      const response = await fetch(`${backendUrl}/admin/all-salaries`, {
        method: "GET",
        headers: {
          "aToken": aToken,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSalaries(data);
        setTotalItems(data.length || 0);
      } else {
        console.error("Error fetching salary:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // Function to handle salary status edit
  const handleEdit = async (id) => {
    try {
      // Send a request to update the status to "Paid"
      const response = await fetch(`${backendUrl}/admin/updateSalary/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "aToken": aToken,
        },
        body: JSON.stringify({ status: "Paid" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedSalary = await response.json();
      message.success(`Salary status updated successfully: ${updatedSalary.status}`);
      
      // Update the state to reflect the change in UI
      setSalaries(prevSalaries =>
        prevSalaries.map(salary =>
          salary._id === id ? { ...salary, status: "Paid" } : salary
        )
      );
    } catch (error) {
      console.error("Error updating salary:", error);
      message.error("Failed to update salary status");
    }
  };

  const columns = [
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Salary",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${amount}`,
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (paymentDate) => new Date(paymentDate).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "Paid" ? "green" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Bonuses",
      dataIndex: "bonuses",
      key: "bonuses",
      render: (bonuses) => (
        <div>
          {bonuses.map((bonus, index) => (
            <div key={index}>
              <b>{bonus.type}</b>: ${bonus.amount}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Deductions",
      dataIndex: "deductions",
      key: "deductions",
      render: (deductions) => (
        <div>
          {deductions.map((deduction, index) => (
            <div key={index}>
              <b>{deduction.type}</b>: ${deduction.amount}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record._id)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleCreateSalary = () => {
    // Show the modal for creating a salary
    setShowCreateForm(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", textAlign: "right" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateSalary} // Show the form when clicked
        >
          Assign Salary
        </Button>
      </div>

      <CreateSalaryModal
        visible={showCreateForm}
        onClose={() => setShowCreateForm(false)} // Close the form
        onSalaryCreated={handleProjectCreated} // Re-fetch salaries after a new salary is created
      />

      <div style={{ overflowX: "auto" }}>
        <Table
          dataSource={salaries}
          columns={columns}
          rowKey="_id"
          pagination={false}
        />
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={10}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Salary;
