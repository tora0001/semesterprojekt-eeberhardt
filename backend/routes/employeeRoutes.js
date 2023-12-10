import express from 'express';
import employeeController from '../controllers/employeeController.js';

const router = express.Router();

router.get('/employee', employeeController.getAllEmployees);
router.get('/employees', employeeController.getAllEmployeesData);
router.get('/employee/:employee_id', employeeController.getEmployeeById);

router.post('/employee', employeeController.createEmployee);

router.put('/employee/:employee_id', employeeController.updateEmployee);

router.delete('/employee/:employee_id', employeeController.deleteEmployee);

export default router;