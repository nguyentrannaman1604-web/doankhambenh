import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import specialtyRoutes from "./routes/specialtyRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import doctorProfileRoutes from "./routes/doctorProfileRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

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
app.use("/api/v1/doctor/schedules", scheduleRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/admin/statistics", statisticsRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/doctor/profile", doctorProfileRoutes);
app.use("/api/v1/ai", aiRoutes);



app.use(errorHandler);

export default app;
