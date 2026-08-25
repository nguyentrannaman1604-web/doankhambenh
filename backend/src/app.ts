import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import specialtyRoutes from "./routes/specialtyRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Clinic Booking API is running",
  });
});

app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/specialties", specialtyRoutes);
app.use("/api/v1/doctors", doctorRoutes);

app.use(errorHandler);

export default app;
