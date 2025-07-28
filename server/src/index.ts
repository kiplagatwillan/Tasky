import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();


app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://tasky-nxzs.vercel.app", 
  ],
  credentials: true,
}));

app.use(express.json());


app.get("/", (req, res) => {
  res.send("API is running...");
});


app.use("/api/auth", authRoutes);    
app.use("/api/user", userRoutes);     
app.use("/api/tasks", taskRoutes);    


app.get("/api", (req, res) => {
  res.send("Welcome to the API endpoint!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

export { prisma };
