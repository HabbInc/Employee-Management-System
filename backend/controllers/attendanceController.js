import EmployeeModel from "../models/employeeModel.js";

export const clockIn = async (req, res)=>{
    try {
        const { employeeId } = req.params;
        const employee = await EmployeeModel.findById(employeeId);
        if (!employee) return res.status(404).json({ message: "Employee not found" });
    
        const today = new Date().toISOString().split("T")[0];
        const attendanceRecord = employee.attendance.find(att => att.date.toISOString().split("T")[0] === today);
    
        if (attendanceRecord) {
            return res.status(400).json({ message: "Already clocked in today" });
        }
    
        employee.attendance.push({ date: new Date(), clockIn: new Date() });
        await employee.save();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const startBreak = async (req, res)=>{
    try {
        const { employeeId } = req.params;
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

    export const endBreak = async (req, res)=> {
        try {
            const { employeeId} = req.params;
            const employee = await EmployeeModel.findById(employeeId);

            if (!employee){
                return res.status(404).json({ message: "Empoloyee not found"});
                }

                //find the attendance record for the current day in an employee's attendance array
                const today = new Date().toISOString().split("T")[0];
                const attendanceRecord = employee.attendance.find(att => att.date.toISOString().split("T")[0] === today);
    
                if(!attendanceRecord || !attendanceRecord.breakStart){
                    return res.status(400).json({ message: "Start break first"});
                }

                attendanceRecord.breakEnd = new Date();
                attendanceRecord.breakDuration = (attendanceRecord.breakEnd - attendanceRecord.breakStart) / (1000 * 60 * 60);

                await employee.save();
                res.status(200).json({ message: "Break ended" , employee });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    export const clockOut = async (req, res) => {
        try {
          const { employeeId } = req.params;
          const employee = await EmployeeModel.findById(employeeId);
          if (!employee) return res.status(404).json({ message: "Employee not found" });
      
          const today = new Date().toISOString().split("T")[0];
          const attendanceRecord = employee.attendance.find(att => att.date.toISOString().split("T")[0] === today);
      
          if (!attendanceRecord || !attendanceRecord.clockIn) {
            return res.status(400).json({ message: "Clock-in required first" });
          }

          if(attendanceRecord.clockOut){
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

      //Get attendance records
      export const getAttendance = async (req, res)=>{
        try {
            const {employeeId} = req.params;
            const employee = await EmployeeModel.findById(employeeId);

            if(!employee){
                return res.status(404).json({ message: "Employee not found" });
            }
                res.status(200).json({attendance: employee.attendance});
            
        } catch (error) {
            res.status(500).json({ error: error.message});
        }
      }

      //Update attendance records
      export const updateAttendance = async (req, res) =>{
        try{
        const { employeeId, attendanceId } = req.params;
        const { clockIn, clockOut, breakStart, breakEnd, breakDuration, totalHours } = req.body;

        const employee = await EmployeeModel.findById(employeeId);

        if (!employee){
            return res.status(404).json({ message: "Employee not found "});
        }

        const attendanceRecord = employee.attendance.id(attendanceId);

        if(!attendanceRecord){
            return res.status(404).json({ message: "Attendance record not found"});
        }

        if (clockIn){
            attendanceRecord.clockIn = new Date(clockIn);
        }

        if(clockOut){
            attendanceRecord.clockOut = new Date(clockOut);
        }

        if(breakStart){
            attendanceRecord.breakStart = new Date(breakStart);
        }
        
        if(breakEnd){
            attendanceRecord.breakEnd = new Date(breakEnd);
        }

        if(breakDuration){
            attendanceRecord.breakDuration = new Date(breakDuration);
        }

        if(totalHours){
            attendanceRecord.totalHours = new Date(totalHours);
        }

        await employee.save();
        res.status(200).json({ message: "Attendance Updated ", employee });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

export const deleteAttendance = async(req, res)=>{
    try {
        const { employeeId, attendanceId } = req.params;
        const employee = await EmployeeModel.findById(employeeId);

        if(!employee){
            return res.status(404).json({ message: "Employee not found "});
        }

        employee.attendance = employee.attendance.filter(att => att._id.toString() !== attendanceId);

        await employee.save();

        res.status(200).json({ message: "Attendance record deleted",employee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
