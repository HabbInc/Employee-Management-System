import express from "express";
import { clockIn, clockOut, startBreak, endBreak, getAttendance, updateAttendance, deleteAttendance } from "../controllers/attendanceController.js";

const attendanceRoute = express.Router();

attendanceRoute.post("/:employeeId/clock-in", clockIn);
attendanceRoute.post("/:employeeId/clock-out", clockOut);
attendanceRoute.post("/:employeeId/start-break", startBreak);
attendanceRoute.post("/:employeeId/end-break", endBreak);
attendanceRoute.get("/:employeeId", getAttendance);
attendanceRoute.put("/:employeeId/:attendanceId", updateAttendance);
attendanceRoute.delete("/:employeeId/:attendanceId", deleteAttendance);

export default attendanceRoute;