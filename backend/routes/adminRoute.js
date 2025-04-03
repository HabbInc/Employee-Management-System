import express from "express";
import { adminLogin, createEmployee } from "../controllers/adminController.js";
import { getAllLeaves, updateLeaveStatus } from "../controllers/leaveController.js";
import authAdmin from "../middleware/authAdmin.js";
import { createProject, deleteProject, getAllProjects, updateProject } from "../controllers/projectController.js";
import upload from "../middleware/multer.js";
import { createSalary, deleteSalary, getAllSalaries, updateSalary } from "../controllers/salaryController.js";

const adminRoute = express.Router();

adminRoute.post('/register',authAdmin,createEmployee)
adminRoute.post('/login',adminLogin)
adminRoute.get('/get-all-leaves',authAdmin,getAllLeaves)
adminRoute.put('/update/:leaveId',authAdmin,updateLeaveStatus)
adminRoute.post('/project',authAdmin,upload.single('image'),createProject)
adminRoute.get('/all-projects',authAdmin,getAllProjects)
adminRoute.put('/update-project/:id',authAdmin,updateProject)
adminRoute.delete('/delete-project/:id',authAdmin,deleteProject)
adminRoute.post('/create-employee',authAdmin,createEmployee)

adminRoute.post('/createSalary',createSalary)
adminRoute.get('/all-salaries',authAdmin,getAllSalaries)
adminRoute.put('/updateSalary/:id',authAdmin,updateSalary)
adminRoute.delete('/deleteSalary/:id',authAdmin,deleteSalary)

export default adminRoute