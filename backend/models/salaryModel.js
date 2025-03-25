import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
    employeeId: {type: mongoose.Schema.Types.ObjectId, ref: "employee"},
    employeeName: {type: String, required: true},
    month: {
        type: String,
        enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        required: true,
      },
    year: {type: Number, required: true},
    amount:{type: Number},
    status:{type: String, enum: ["Pending", "Paid", "Filed"], default: "Pending"},
    paymentDate: {type: Date},
    bonuses: [{type: {type: String}, amount: Number}],
    deductions: [{type: {type: String}, amount: Number}],
}, {timestamps: true})

const SalaryModel = mongoose.models.salary || mongoose.model('salary',salarySchema)
export default SalaryModel;