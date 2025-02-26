import mongoose from "mongoose";

const LeaveManagementSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    applyDate: { type: Date, default: Date.now },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    leaveDays: { type: Number, required: true }, // Auto-calculate from fromDate to toDate
    halfDay: { type: Boolean, default: false },
    leaveType: { 
      type: String, 
      enum: ["Sick Leave", "Casual Leave", "Paid Leave", "Unpaid Leave", "Maternity Leave"], 
      required: true 
    },
    status: { type: String, enum: ["Pending", "Approved", "Rejected", "Canceled"], default: "Pending" },
    reason: { type: String },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, 
}, { timestamps: true });

const LeaveManagementModel = mongoose.models.leaveManagement || mongoose.model("leaveManagement", LeaveManagementSchema);

export default LeaveManagementModel