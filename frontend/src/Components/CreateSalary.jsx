




// import React, { useContext, useState } from "react";
// import { Modal, Form, Input, DatePicker, Select, Button, message, Row, Col } from "antd";
// import { AdminContext } from "../context/AdminContext"; // Assuming context for backend URL and auth token

// const { Option } = Select;

// const CreateSalaryModal = ({ visible, onClose, onSalaryCreated }) => {
//   const [loading, setLoading] = useState(false);
//   const { aToken, backendUrl } = useContext(AdminContext); // Extracting context for backend URL and token

//   const handleFinish = async (values) => {
//     setLoading(true);

//     // Convert paymentDate to a string in YYYY-MM-DD format
//     const paymentDate = values.paymentDate ? values.paymentDate.format("YYYY-MM-DD") : null;

//     // Check if all required fields are provided
//     if (!values.employeeId || !values.employeeName || !values.amount || !values.month || !values.year) {
//       message.error("All required fields must be filled.");
//       setLoading(false);
//       return;
//     }

//     // Parse bonuses and deductions if provided
//     const bonuses = values.bonuses ? JSON.parse(values.bonuses) : [];
//     const deductions = values.deductions ? JSON.parse(values.deductions) : [];

//     const salaryData = {
//       employeeId: values.employeeId,
//       employeeName: values.employeeName,
//       month: values.month,
//       year: values.year,
//       amount: values.amount,
//       paymentDate,
//       bonuses,
//       deductions,
//     };

//     try {
//       // Send POST request to backend for salary creation
//       const response = await fetch('http://localhost:5000/admin/createSalary', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(salaryData),
//       });
      

//       const responseData = await response.json(); // Parse response

//       if (responseData._id) {
//         message.success("Salary record created successfully!");
//         onSalaryCreated(); // Refresh the salary list in the parent component
//         onClose(); // Close the modal
//       } else {
//         message.error(responseData.message || "Failed to create salary record");
//       }
//     } catch (error) {
//       console.error("Error creating salary record:", error); // Log error
//       message.error("Error creating salary record: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       title="Create Salary Record"
//       visible={visible}
//       onCancel={onClose}
//       footer={null}
//     >
//       <Form layout="vertical" onFinish={handleFinish}>
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item name="employeeName" label="Employee Name" rules={[{ required: true }]}>
//               <Input placeholder="Enter employee name" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="employeeId" label="Employee ID" rules={[{ required: true }]}>
//               <Input placeholder="Enter employee ID" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item name="month" label="Month" rules={[{ required: true }]}>
//               <Select placeholder="Select month">
//                 {[...Array(12).keys()].map((i) => (
//                   <Option key={i + 1} value={i + 1}>
//                     {new Date(0, i).toLocaleString("default", { month: "long" })}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="year" label="Year" rules={[{ required: true }]}>
//               <Input placeholder="Enter year" type="number" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item name="amount" label="Salary Amount" rules={[{ required: true }]}>
//               <Input placeholder="Enter salary amount" type="number" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="paymentDate" label="Payment Date" rules={[{ required: true }]}>
//               <DatePicker style={{ width: "100%" }} />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item name="bonuses" label="Bonuses" rules={[{ required: false }]}>
//               <Input placeholder="Enter bonuses as JSON array" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="deductions" label="Deductions" rules={[{ required: false }]}>
//               <Input placeholder="Enter deductions as JSON array" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" loading={loading}>
//             Create Salary Record
//           </Button>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default CreateSalaryModal;



import React, { useContext, useState, useRef } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message, Row, Col } from "antd";
import { AdminContext } from "../context/AdminContext"; // Assuming context for backend URL and auth token

const { Option } = Select;

const CreateSalaryModal = ({ visible, onClose, onSalaryCreated }) => {
  const [loading, setLoading] = useState(false);
  const { aToken, backendUrl } = useContext(AdminContext); // Extracting context for backend URL and token
  
  // Create a ref to the form
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    setLoading(true);

    // Convert paymentDate to a string in YYYY-MM-DD format
    const paymentDate = values.paymentDate ? values.paymentDate.format("YYYY-MM-DD") : null;

    // Check if all required fields are provided
    if (!values.employeeId || !values.employeeName || !values.amount || !values.month || !values.year) {
      message.error("All required fields must be filled.");
      setLoading(false);
      return;
    }

    // Parse bonuses and deductions if provided
    const bonuses = values.bonuses ? JSON.parse(values.bonuses) : [];
    const deductions = values.deductions ? JSON.parse(values.deductions) : [];

    const salaryData = {
      employeeId: values.employeeId,
      employeeName: values.employeeName,
      month: values.month,
      year: values.year,
      amount: values.amount,
      paymentDate,
      bonuses,
      deductions,
    };

    try {
      // Send POST request to backend for salary creation
      const response = await fetch('http://localhost:5000/admin/createSalary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salaryData),
      });
      

      const responseData = await response.json(); // Parse response

      if (responseData._id) {
        message.success("Salary record created successfully!");
        onSalaryCreated(); // Refresh the salary list in the parent component
        onClose(); // Close the modal
        form.resetFields(); // Reset the form fields
      } else {
        message.error(responseData.message || "Failed to create salary record");
      }
    } catch (error) {
      console.error("Error creating salary record:", error); // Log error
      message.error("Error creating salary record: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Salary Record"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="employeeName" label="Employee Name" rules={[{ required: true }]}>
              <Input placeholder="Enter employee name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="employeeId" label="Employee ID" rules={[{ required: true }]}>
              <Input placeholder="Enter employee ID" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="month" label="Month" rules={[{ required: true }]}>
              <Select placeholder="Select month">
                {[...Array(12).keys()].map((i) => (
                  <Option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="year" label="Year" rules={[{ required: true }]}>
              <Input placeholder="Enter year" type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="amount" label="Salary Amount" rules={[{ required: true }]}>
              <Input placeholder="Enter salary amount" type="number" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="paymentDate" label="Payment Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="bonuses" label="Bonuses" rules={[{ required: false }]}>
              <Input placeholder="Enter bonuses as JSON array" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="deductions" label="Deductions" rules={[{ required: false }]}>
              <Input placeholder="Enter deductions as JSON array" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Salary Record
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSalaryModal;
