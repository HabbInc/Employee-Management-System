import LeaveManagementModel from "../models/leaveManagementModel.js";
import Employee from "../models/employeeModel.js"; // Keep this import in case you use it elsewhere

// Apply for Leave (Employee)
export const applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, leaveType, halfDay = false, reason } = req.body;
    const employeeId = req.userId;

    if (!fromDate || !toDate || !leaveType || !reason) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const leaveDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

    if (leaveDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range. Please check 'from' and 'to' dates.",
      });
    }

    const leaveManagement = new LeaveManagementModel({
      employeeId,
      fromDate,
      toDate,
      leaveDays,
      leaveType,
      halfDay,
      reason,
    });

    await leaveManagement.save();

    res
      .status(200)
      .json({ success: true, message: "Leave applied successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Leaves by Logged-in Employee
export const getEmployeeLeaves = async (req, res) => {
  try {
    const employeeId = req.userId;
    const leaves = await LeaveManagementModel.find({ employeeId });

    res.status(200).json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel Leave (by Employee)
export const cancelLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;

    const leave = await LeaveManagementModel.findByIdAndUpdate(
      leaveId,
      { status: "Canceled" },
      { new: true }
    );

    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Leave canceled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get All Leave Requests
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveManagementModel.find().populate({
      path: "employeeId",
      model: "employee", // 👈 Use correct model name as registered
      select: "name email"
    });

    res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Error in getAllLeaves:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Approve / Reject Leave
export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, approvedBy } = req.body;

    if (!status || typeof status !== "string") {
      return res.status(400).json({
        success: false,
        message: "Status is required and must be a string",
      });
    }

    if (!approvedBy) {
      return res
        .status(400)
        .json({ success: false, message: "approvedBy is required" });
    }

    const leave = await LeaveManagementModel.findByIdAndUpdate(
      leaveId,
      { status, approvedBy: null },
      { new: true }
    );

    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }

    res.status(200).json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
      leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
