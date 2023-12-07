import express from "express";
import cors from "cors";
import mysql from "mysql2";
import "dotenv/config";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Test APP listening on port ${port}`));

const dbconfig = {
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
};

if (process.env.MYSQL_CERT) {
  dbconfig.ssl = { cs: fs.readFileSync("DigiCertGlobalRootCA.crt.pem") };
}

const connection = mysql.createConnection(dbconfig);

//get all imployees

app.get("/employee", (req, res) => {
  const query = "SELECT * FROM employee";

  connection.query(query, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
});

app.get("/employees", (req, res) => {
  const query = "SELECT name, e.employee_id, e.vacation_days, r.role_name, s.status FROM employee e INNER JOIN roles r ON e.role_id = r.role_id INNER JOIN status s ON e.status_id = s.status_id;";

  connection.query(query, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
});

//get employee by id

app.get("/employee/:employee_id", (req, res) => {
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
});

//create new employee

app.post("/employee", (req, res) => {
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
});

//update employee by id

app.put("/employee/:employee_id", (req, res) => {
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
});

//delete employee by id

app.delete("/employee/:employee_id", (req, res) => {
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
});

// get all vacations
app.get("/vacation", (req, res) => {
  const query = "SELECT * FROM vacation";

  connection.query(query, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
});

// get selected data for table view
app.get("/vacations", (req, res) => {
  const query = "SELECT employee.employee_id, employee.name, vacation.vacation_id, vacation.startDate, vacation.endDate FROM employee INNER JOIN vacation ON employee.employee_id = vacation.employee_id;";

  connection.query(query, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
});

// get employee status

app.get("/employeestatus/:employee_id", (req, res) => {
  const id = req.params.employee_id;
  const query = "SELECT employee.name, status.status FROM employee INNER JOIN status ON employee.status_id = status.status_id WHERE employee_id=?;";
  const values = [id];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
});

// create new vacation
app.post("/vacation", (req, res) => {
  const vacation = req.body;
  const query = "INSERT INTO vacation(employee_id, startDate, endDate) values(?,?,?);";
  const values = [vacation.employee_id, vacation.startDate, vacation.endDate];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
});

// delete vacation
app.delete("/vacation/:vacation_id", (req, res) => {
  const id = req.params.vacation_id;
  const query = "DELETE FROM vacation WHERE vacation_id=?;";
  const values = [id];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
});

// edit vacation
app.put("/vacation/:vacation_id", (req, res) => {
  const id = req.params.vacation_id;
  const vacation = req.body;
  const query = "UPDATE vacation SET employee_id=?, startDate=?, endDate=? WHERE vacation_id=?;";
  const values = [vacation.employee_id, vacation.startDate, vacation.endDate, id];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
});

// get employee role
app.get("/employeerole/:employee_id", (req, res) => {
  const id = req.params.employee_id;
  const query = "SELECT employee.employee_id, employee.name, roles.role_name FROM employee INNER JOIN roles ON employee.status_id = roles.role_id;";
  const values = [id];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
});

// get roles 
app.get("/roles", (req, res) => {
  const query = "SELECT * FROM roles;";

  connection.query(query, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
});
