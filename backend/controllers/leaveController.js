import LeaveManagementModel from "../models/leaveManagementModel.js";


export const applyLeave = async (req, res) => {

    try {
        const { fromDate, toDate, leaveDays, leaveType, halfDay, reason} = req.body;
        const employeeId = req.userId 
        console.log(employeeId);



        if( !fromDate || !toDate || !leaveDays || !leaveType|| !reason ){
            return res.status(400).json({success:false, message:"All fields are required"});
        }

        const leaveManagement = new LeaveManagementModel({employeeId, fromDate, toDate, leaveDays, leaveType, halfDay, reason});

        await leaveManagement.save();

        res.status(200).json({success:true, message:"Leave applied successfully"});
        
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
}


export const getEmployeeLeaves = async (req, res) => {
    try {
        const employeeId = req.userId;
        const leaves = await LeaveManagementModel.find({employeeId});

        res.status(200).json({success:true, leaves});
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
        
    }
}

export const cancelLeave = async (req, res) => {
    try {
        const {leaveId} = req.params;

        const leave = await LeaveManagementModel.findByIdAndUpdate(leaveId, {status:"Canceled"}, {new:true});
        
        if(!leave){
            return res.status(404).json({success:false, message:"Leave not found"});
        }

        res.status(200).json({success:true, message:"Leave canceled successfully"});
        
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
}


//Admin get all leaves
export const getAllLeaves = async (req, res) => {

    try {
        const leaves = await LeaveManagementModel.find();

        res.status(200).json({success:true, leaves});
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
}

//approve or reject leave request
export const updateLeaveStatus = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const { status, approvedBy } = req.body;

        // Ensure status is provided and is a string
        if (!status || typeof status !== "string") {
            return res.status(400).json({ success: false, message: "Status is required and must be a string" });
        }

        // Validate approvedBy
        if (!approvedBy) {
            return res.status(400).json({ success: false, message: "approvedBy is required" });
        }

        // Update the leave request
        const leave = await LeaveManagementModel.findByIdAndUpdate(
            leaveId,
            { status, approvedBy },
            { new: true }
        );

        if (!leave) { 
            return res.status(404).json({ success: false, message: "Leave not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: `Leave request ${status.toLowerCase()} successfully`, 
            leave 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


