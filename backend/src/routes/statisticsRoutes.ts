import { Router } from "express";

import {
  overview,
  appointmentsByDate,
  topDoctors,
} from "../controllers/statisticsController.js";

import {
  authenticate,
  authorize,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.use(
  authenticate,
  authorize("ADMIN", "RECEPTIONIST")
);

router.get(
  "/overview",
  overview
);

router.get(
  "/appointments-by-date",
  appointmentsByDate
);

router.get(
  "/top-doctors",
  topDoctors
);

export default router;