import mongoose from "mongoose";
import SalaryModel from "../models/salaryModel.js";
import EmployeeModel from "../models/employeeModel.js";

const getAllSalaries = async (req, res)=>{
    try {
        const salaries = await SalaryModel.find();
        res.status(200).json(salaries);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getSalaryById = async (req, res)=>{
    const { id } = req.params;

    try {
        const salary = await SalaryModel.findById(id);
        if (!salary){
            return res.status(404).json({ message: "Salary not found"});
        }
        res.status(200).json(salary);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const createSalary = async (req, res) => {
    try {
        const { employeeId, month, year, amount, paymentDate, bonuses, deductions } = req.body;

        // Convert month from numeric (e.g. 6) to string (e.g. "June")
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const monthString = monthNames[month - 1]; // Convert numeric month to string
        
        // Validate if monthString is valid
        if (!monthString) {
            return res.status(400).json({ message: "Invalid month number" });
        }

        // Other logic remains unchanged
        const employeeObjectId = new mongoose.Types.ObjectId(employeeId);

        // Check if salary already exists
        const existingSalary = await SalaryModel.findOne({ employeeId, year, monthString });
        if (existingSalary) {
            return res.status(409).json({ message: "Salary record already exists for this employee for the given month and year." });
        }

        // Fetch employee details
        const employee = await EmployeeModel.findById(employeeObjectId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        // Create a new salary entry
        const newSalary = new SalaryModel({
            employeeId,
            employeeName: employee.name,
            month: monthString,  // Use the string month here
            year,
            amount,
            paymentDate,
            bonuses,
            deductions,
        });

        await newSalary.save();
        res.status(201).json(newSalary);
    } catch (error) {
        console.error("Error creating salary:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const updateSalary = async (req, res) => {
    const { id } = req.params; // The salary ID from the request params
    const { status } = req.body; // The new status from the request body
  
    try {
        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: `Invalid salary ID: ${id}` });
        }

        // Find and update the salary entry
        const updatedSalary = await SalaryModel.findByIdAndUpdate(
            id, // ID to update
            { status }, // Update the status field
            { new: true, runValidators: true } // Return the updated document and apply validation
        );

        // If the salary entry was not found
        if (!updatedSalary) {
            return res.status(404).send({ message: `No salary found with id: ${id}` });
        }

        // Respond with the updated salary
        res.status(200).json(updatedSalary);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

  

const deleteSalary = async (req, res)=>{
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send(`No salary with id: ${id}`);
    }

    await SalaryModel.findByIdAndDelete(id);

    res.json({ message: "Salary deleted sucessfully"});
};

export { getAllSalaries, getSalaryById, createSalary, updateSalary, deleteSalary};