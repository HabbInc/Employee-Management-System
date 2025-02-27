import mongoose from "mongoose";
import SalaryModel from "../models/salaryModel.js";

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

const createSalary = async (req, res)=>{
    const salary = req.body;

    const newSalary = new SalaryModel(salary);

    try {
        await newSalary.save();
        res.status(201).json(newSalary);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

const updateSalary = async (req, res)=>{
    const { id } = req.params;
    const { employeeId, employeeName, month, year, amount, status, paymentDate, bonuses, deductions} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send(`No salary with id: ${id}`);
    }

    const updatedSalary = {employeeId, employeeName, month, year, amount, status, paymentDate, bonuses, deductions, _id: id};

    await SalaryModel.findByIdAndUpdate(id, updatedSalary, { new: true });

    res.json(updatedSalary);
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