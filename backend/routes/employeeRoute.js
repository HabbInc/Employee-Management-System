import express from "express";
import { login, logout, register } from "../controllers/employeeController.js";
import { applyLeave, cancelLeave, getEmployeeLeaves } from "../controllers/leaveController.js";
import userAuth from "../middleware/userAuth.js";
import {  updateProjectProgress, viewAssignedProjects } from "../controllers/projectController.js";

const employeeRoute = express.Router();

employeeRoute.post('/register',register)
employeeRoute.post('/login',login)
employeeRoute.post('/logout',logout)
employeeRoute.post('/apply-leave',userAuth,applyLeave)
employeeRoute.get('/get-leave',userAuth,getEmployeeLeaves)
employeeRoute.put('/cancel/:leaveId',userAuth,cancelLeave)
employeeRoute.get('/view-assigned-projects',userAuth,viewAssignedProjects)
employeeRoute.put('/get-projects/:id',userAuth,updateProjectProgress)
export default employeeRoute