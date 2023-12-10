// employeeController.js
import { connection } from '../database.js';

class EmployeeController {
  // get all employees, /employee
  getAllEmployees(req, res) {
    const query = 'SELECT * FROM employee';

    connection.query(query, (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    });
  }

  // get all data from /employees for table view
  getAllEmployeesData(req, res) {
    const query = "SELECT name, e.employee_id, e.vacation_days, e.role_id, r.role_name, s.status FROM employee e INNER JOIN roles r ON e.role_id = r.role_id INNER JOIN status s ON e.status_id = s.status_id;";

    connection.query(query, (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    });
  }
  
  //get employee by id
  getEmployeeById(req, res) {
    const id = req.params.employee_id;
    const query = "SELECT * FROM employee WHERE employee_id=?;";
    const values = [id];

    connection.query(query, values, (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    });
  }

  //create new employee
  createEmployee(req, res) {
    const employee = req.body;
    const query = "INSERT INTO employee(name, role_id, vacation_days, status_id) values(?,?,?,?);";
    const values = [employee.name, employee.role_id, employee.vacation_days, employee.status_id];

    connection.query(query, values, (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    });
  }

  //update employee by id
  updateEmployee(req, res) {
    const id = req.params.employee_id;
    const employee = req.body;
    const query = "UPDATE employee SET name=?, role_id=?, vacation_days=?, status_id=? WHERE employee_id=?;";
    const values = [employee.name, employee.role_id, employee.vacation_days, employee.status_id, id];

    connection.query(query, values, (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    });
  }

  //delete employee by id
  deleteEmployee(req, res) {
    const id = req.params.employee_id;
    const query = "DELETE FROM employee WHERE employee_id=?;";
    const values = [id];

    connection.query(query, values, (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    });
  }

  // Other CRUD functions for employees
}

export default new EmployeeController();