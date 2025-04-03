import EmployeeModel from "../models/employeeModel.js";

// // Clock In
// export const clockIn = async (req, res) => {
//     try {
//         const employeeId = req.userId; // ✅ FIXED

//         const employee = await EmployeeModel.findById(employeeId);
//         if (!employee) return res.status(404).json({ message: "Employee not found" });
    
//         const today = new Date().toISOString().split("T")[0];
//         const attendanceRecord = employee.attendance.find(att => att.date.toISOString().split("T")[0] === today);
    
//         if (attendanceRecord) {
//             return res.status(400).json({ message: "Already clocked in today" });
//         }
    
//         employee.attendance.push({ date: new Date(), clockIn: new Date() });
//         await employee.save();
//         res.status(200).json({ message: "Clocked in successfully", employee });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


export const clockIn = async (req, res) => {
    try {
      const employeeId = req.userId; // ✅ not destructured
  
      const employee = await EmployeeModel.findById(employeeId);
      if (!employee) return res.status(404).json({ message: "Employee not found" });
  
      const today = new Date().toISOString().split("T")[0];
      const attendanceRecord = employee.attendance.find(
        att => att.date.toISOString().split("T")[0] === today
      );
  
      if (attendanceRecord) {
        return res.status(400).json({ message: "Already clocked in today" });
      }
  
      employee.attendance.push({ date: new Date(), clockIn: new Date() });
      await employee.save();
      res.status(200).json({ message: "Clocked in successfully", employee });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Start Break
export const startBreak = async (req, res) => {
    try {
        const  employeeId  =req.userId;
        const employee = await EmployeeModel.findById(employeeId);
        if (!employee) return res.status(404).json({ message: "Employee not found" });
    
        const today = new Date().toISOString().split("T")[0];
        const attendanceRecord = employee.attendance.find(att => att.date.toISOString().split("T")[0] === today);
    
        if (!attendanceRecord || !attendanceRecord.clockIn) return res.status(400).json({ message: "Clock-in required first" });
    
        if (attendanceRecord.breakStart) return res.status(400).json({ message: "Break already started" });
    
        attendanceRecord.breakStart = new Date();
        await employee.save();
        res.status(200).json({ message: "Break started", employee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// End Break
export const endBreak = async (req, res) => {
    try {
        const  employeeId  = req.userId;
        const employee = await EmployeeModel.findById(employeeId);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        const today = new Date().toISOString().split("T")[0];
        const attendanceRecord = employee.attendance.find(att => att.date.toISOString().split("T")[0] === today);

        if (!attendanceRecord || !attendanceRecord.breakStart) return res.status(400).json({ message: "Start break first" });

        attendanceRecord.breakEnd = new Date();
        attendanceRecord.breakDuration = (attendanceRecord.breakEnd - attendanceRecord.breakStart) / (1000 * 60); // Break duration in minutes

        await employee.save();
        res.status(200).json({ message: "Break ended", employee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Clock Out
export const clockOut = async (req, res) => {
    try {
        const  employeeId  =req.userId;
        const employee = await EmployeeModel.findById(employeeId);
        if (!employee) return res.status(404).json({ message: "Employee not found" });
    
        const today = new Date().toISOString().split("T")[0];
        const attendanceRecord = employee.attendance.find(att => att.date.toISOString().split("T")[0] === today);
    
        if (!attendanceRecord || !attendanceRecord.clockIn) {
            return res.status(400).json({ message: "Clock-in required first" });
        }

        if (attendanceRecord.clockOut) {
            return res.status(400).json({ message: "Already clocked out" });
        }
    
        attendanceRecord.clockOut = new Date();
    
        const totalHoursWorked = (attendanceRecord.clockOut - attendanceRecord.clockIn) / (1000 * 60 * 60);
        attendanceRecord.totalHours = totalHoursWorked - (attendanceRecord.breakDuration || 0); // Subtract break time
    
        await employee.save();
        res.status(200).json({ message: "Clocked out successfully", employee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getAttendanceStatus = async (req, res) => {
    try {
      const employeeId = req.userId;
      const employee = await EmployeeModel.findById(employeeId);
  
      if (!employee) return res.status(404).json({ message: "Employee not found" });
  
      const today = new Date().toISOString().split("T")[0];
      const attendance = employee.attendance.find(
        (a) => a.date.toISOString().split("T")[0] === today
      );
  
      if (!attendance) return res.json({ state: "none" });
      if (attendance.breakStart && !attendance.breakEnd) return res.json({ state: "on-break" });
      if (attendance.clockIn && !attendance.clockOut) return res.json({ state: "clocked-in" });
  
      return res.json({ state: "none" });
    } catch (error) {
      res.status(500).json({ message: "Error fetching status", error: error.message });
    }
  };
  
  
// Get Attendance Records
export const getAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const employee = await EmployeeModel.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({ attendance: employee.attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Attendance Record
export const updateAttendance = async (req, res) => {
    try {
        const { employeeId, attendanceId } = req.params;
        const { clockIn, clockOut, breakStart, breakEnd, breakDuration, totalHours } = req.body;

        const employee = await EmployeeModel.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const attendanceRecord = employee.attendance.id(attendanceId);

        if (!attendanceRecord) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        if (clockIn) {
            attendanceRecord.clockIn = new Date(clockIn);
        }

        if (clockOut) {
            attendanceRecord.clockOut = new Date(clockOut);
        }

        if (breakStart) {
            attendanceRecord.breakStart = new Date(breakStart);
        }

        if (breakEnd) {
            attendanceRecord.breakEnd = new Date(breakEnd);
        }

        if (breakDuration) {
            attendanceRecord.breakDuration = breakDuration; // Assuming breakDuration is passed as minutes or another unit
        }

        if (totalHours) {
            attendanceRecord.totalHours = totalHours; // Assuming totalHours is passed in hours
        }

        await employee.save();
        res.status(200).json({ message: "Attendance updated", employee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Attendance Record
export const deleteAttendance = async (req, res) => {
    try {
        const { employeeId, attendanceId } = req.params;
        const employee = await EmployeeModel.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        employee.attendance = employee.attendance.filter(att => att._id.toString() !== attendanceId);

        await employee.save();

        res.status(200).json({ message: "Attendance record deleted", employee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get today's attendance for all employees (Admin view)
export const getTodayAttendance = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];

        const employees = await EmployeeModel.find();

        const todayAttendance = employees.map(emp => {
            const attendance = emp.attendance.find(att => att.date.toISOString().split("T")[0] === today);
            return attendance
                ? {
                      employeeId: emp._id,
                      name: emp.name,
                      email: emp.email,
                      department: emp.department,
                      designation: emp.designation,
                      clockIn: attendance.clockIn,
                      clockOut: attendance.clockOut,
                      breakDuration: attendance.breakDuration || 0,
                      totalHours: attendance.totalHours || 0,
                  }
                : null;
        }).filter(Boolean); // filter out employees with no attendance today

        res.status(200).json({ attendance: todayAttendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
