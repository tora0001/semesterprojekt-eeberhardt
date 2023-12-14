// index.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import employeeRoutes from './routes/employeeRoutes.js';
import vacationRoutes from './routes/vacationRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import './util/autoUpdater.js';

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Test APP listening on port ${port}`));

// Use routes
app.use(employeeRoutes);
app.use(vacationRoutes);
app.use(roleRoutes);
