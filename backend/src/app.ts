import express from "express";
import cors from "cors";

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

export default app;