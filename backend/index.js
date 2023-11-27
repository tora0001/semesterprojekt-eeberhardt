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

//employee routes

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

app.post("/employee", (req, res) => {
  const employee = req.body;
  const query = "INSERT INTO employee(name, rolle_id, ferieDage, status_id) values(?,?,?,?);";
  const values = [employee.name, employee.rolle_id, employee.ferieDage, employee.status_id];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
});

app.get("/vacation", (req, res) => {
  const query = "SELECT * FROM vacation";

  connection.query(query, function (err, results) {
    res.json(results);
  });
});
