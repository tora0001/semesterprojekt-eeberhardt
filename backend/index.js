// index.js
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import 'dotenv/config';
import fs from 'fs';
import employeeRoutes from './routes/employeeRoutes.js';
import vacationRoutes from './routes/vacationRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import './util/autoUpdater.js';

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
  dbconfig.ssl = { cs: fs.readFileSync('DigiCertGlobalRootCA.crt.pem') };
}

const connection = mysql.createConnection(dbconfig);

// Use routes
app.use(employeeRoutes);
app.use(vacationRoutes);
app.use(roleRoutes);

// // get employee role
// app.get("/employeerole/:employee_id", (req, res) => {
//   const id = req.params.employee_id;
//   const query = "SELECT employee.employee_id, employee.name, roles.role_name FROM employee INNER JOIN roles ON employee.status_id = roles.role_id;";
//   const values = [id];

//   connection.query(query, values, (error, results) => {
//     if (error) {
//       console.log(error);
//     } else {
//       res.json(results);
//     }
//   });
// });

