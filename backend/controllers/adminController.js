import jwt from "jsonwebtoken";
import EmployeeModel from "../models/employeeModel.js";
import transporter from "../config/nodemailer.js";


//Admin Login Controller
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      // Admin email and password check
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        // Sign the JWT token
        const token = jwt.sign(
          { email, role: 'admin' },  // Set the role as 'admin'
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
  
        // Send the token to the client
        return res.json({ success: true, token });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };


  //create new Employee
  export const createEmployee = async (req, res) => {
    const { name, email, role } = req.body;
    const userRole = role || 'employee';

    if (!name || !email) {
        return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    try {
        const existingUser = await EmployeeModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create a temporary user entry
        const newEmployee = new EmployeeModel({ name, email, role: userRole, password: null });
        await newEmployee.save();

        // Generate a registration token (expires in 24 hours)
        const token = jwt.sign({ id: newEmployee._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Send registration email with the link
        const registrationLink = `http://localhost:5000/employee/complete-registration?token=${token}`;
        console.log(registrationLink);


        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Welcome, ${name}! Complete Your Registration 🚀`,
            text: `Hello ${name},\n\nYour admin has invited you to join the POS system.\nClick the link below to set your password and activate your account:\n\n${registrationLink}\n\nThis link will expire in 24 hours.`,
            html: `<p>Hello <strong>${name}</strong>,</p>
                   <p>Your admin has invited you to join the POS system.</p>
                   <p><a href="${registrationLink}">Click here</a> to set your password and activate your account.</p>
                   <p><i>This link will expire in 24 hours.</i></p>`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ success: true, message: "Invitation sent to employee's email" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
        console.error(error);
    }
};