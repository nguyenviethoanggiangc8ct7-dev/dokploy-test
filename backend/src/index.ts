import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { categoryRoutes } from './routes/categories';
import { locationRoutes } from './routes/locations';
import { employeeRoutes } from './routes/employees';
import { hardwareRoutes } from './routes/hardware';
import { softwareRoutes } from './routes/software';
import { dashboardRoutes } from './routes/dashboard';
import { reportRoutes } from './routes/reports';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/hardware', hardwareRoutes);
app.use('/api/software', softwareRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 QLTSIT Backend running on port ${PORT}`);
});
