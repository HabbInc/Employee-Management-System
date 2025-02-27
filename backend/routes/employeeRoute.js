import express from "express";
import { login, logout, register } from "../controllers/employeeController.js";

const employeeRoute = express.Router();

employeeRoute.post('/register',register);
employeeRoute.post('/login',login);
employeeRoute.post('/logout',logout);

export default employeeRoute