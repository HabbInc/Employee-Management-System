import express from "express";
import { completeRegistration, login, logout, profile, updateProfile } from "../controllers/employeeController.js";
import { applyLeave, cancelLeave, getEmployeeLeaves } from "../controllers/leaveController.js";
import userAuth from "../middleware/userAuth.js";
import {  updateProjectProgress, viewAssignedProjects } from "../controllers/projectController.js";

import upload from "../middleware/multer.js";

import { getSalaryById } from "../controllers/salaryController.js";


const employeeRoute = express.Router();


employeeRoute.post('/login',login);
employeeRoute.post('/logout',logout);


employeeRoute.post('/register',completeRegistration)
employeeRoute.post('/login',login)
employeeRoute.post('/logout',logout)
employeeRoute.post('/apply-leave',userAuth,applyLeave)
employeeRoute.get('/get-leave',userAuth,getEmployeeLeaves)
employeeRoute.put('/cancel/:leaveId',userAuth,cancelLeave)
employeeRoute.get('/view-assigned-projects',userAuth,viewAssignedProjects)
employeeRoute.put('/get-projects/:id',userAuth,updateProjectProgress)
employeeRoute.post('/complete-registration',completeRegistration)
employeeRoute.get('/user-profile',userAuth,profile)
employeeRoute.put('/update-profile',userAuth,upload.single('image'),updateProfile)


employeeRoute.get('/getSalarybyId/:id',userAuth,getSalaryById)

export default employeeRoute