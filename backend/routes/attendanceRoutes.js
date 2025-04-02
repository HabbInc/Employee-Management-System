// import express from "express";
// import { clockIn, clockOut, startBreak, endBreak, getAttendance, updateAttendance, deleteAttendance, getTodayAttendance, getAttendanceStatus } from "../controllers/attendanceController.js";
// import userAuth from "../middleware/userAuth.js";

// const attendanceRoute = express.Router();

// // ✅ REPLACE THIS:
// attendanceRoute.post("/:employeeId/clock-in", userAuth, clockIn);

// // ✅ WITH THIS:
// attendanceRoute.post("/clock-in", userAuth, clockIn);
// attendanceRoute.post("/clock-out", userAuth, clockOut);
// attendanceRoute.post("/start-break", userAuth, startBreak);
// attendanceRoute.post("/end-break", userAuth, endBreak);
// attendanceRoute.get("/status", userAuth, getAttendanceStatus); // optional


// attendanceRoute.put("/:employeeId/:attendanceId", updateAttendance);
// attendanceRoute.delete("/:employeeId/:attendanceId", deleteAttendance);
// attendanceRoute.get("/admin/attendance/today", getTodayAttendance);

// export default attendanceRoute;


import express from "express";
import {
  clockIn,
  clockOut,
  startBreak,
  endBreak,
  getAttendanceStatus
} from "../controllers/attendanceController.js";
import userAuth from "../middleware/userAuth.js";

const attendanceRoute = express.Router();

// ✅ NEW ROUTES using middleware (req.userId from token)
attendanceRoute.post("/clock-in", userAuth, clockIn);
attendanceRoute.post("/clock-out", userAuth, clockOut);
attendanceRoute.post("/start-break", userAuth, startBreak);
attendanceRoute.post("/end-break", userAuth, endBreak);
attendanceRoute.get("/status", userAuth, getAttendanceStatus);


//  attendanceRoute.put("/:employeeId/:attendanceId", updateAttendance);
//  attendanceRoute.delete("/:employeeId/:attendanceId", deleteAttendance);
//  attendanceRoute.get("/admin/attendance/today", getTodayAttendance);

export default attendanceRoute;
