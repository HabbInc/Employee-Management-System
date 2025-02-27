import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
    employeeId: {type: mongoose.Schema.Types.ObjectId, ref: "employee", required: true},
    employeeName: {type: String, required: true},
    month: {type: Number, required: true, min: 1, max: 12},
    year: {type: Number, required: true},
    amount:{type: Number, required: true},
    status:{type: String, enum: ["Pending", "Paid", "Filed"], default: "Pending"},
    paymentDate: {type: Date},
    bonuses: [{type: {type: String}, amount: Number}],
    deductions: [{type: {type: String}, amount: Number}],
}, {timestamps: true})

const SalaryModel = mongoose.models.salary || mongoose.model('salary',salarySchema)
export default SalaryModel;