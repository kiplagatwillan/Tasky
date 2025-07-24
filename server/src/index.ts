import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes'; // <-- New import for task routes

dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

// Health check endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes); // <-- New route for tasks

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Expose Prisma Client instance for use in routes
export { prisma };