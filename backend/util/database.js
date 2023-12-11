import mysql from 'mysql2';
import fs from 'fs';

const dbconfig = {
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
};

if (process.env.MYSQL_CERT) {
  dbconfig.ssl = { ca: fs.readFileSync('DigiCertGlobalRootCA.crt.pem') };
}

export const connection = mysql.createConnection(dbconfig);