import express from 'express';
import { createSalary, deleteSalary, getAllSalaries, getSalaryById, updateSalary } from '../controllers/salaryController.js';

const salaryRoute = express.Router();

salaryRoute.get('/', getAllSalaries);
salaryRoute.get('/:id', getSalaryById);
salaryRoute.post('/',createSalary);
salaryRoute.put('/:id', updateSalary);
salaryRoute.delete('/:id', deleteSalary);

export default salaryRoute;