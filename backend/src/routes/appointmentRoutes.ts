import { Router } from "express";

import {
  create,
  getMine,
  cancelMine,
  getDoctorDailyAppointments,
  complete,
  getAllForAdmin,
  confirm,
  cancelByStaff
} from "../controllers/appointmentController.js";

import {
  authenticate,
  authorize,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("PATIENT"),
  create
);

router.get(
  "/my",
  authenticate,
  authorize("PATIENT"),
  getMine
);

router.patch(
  "/:id/cancel",
  authenticate,
  authorize("PATIENT"),
  cancelMine
);

router.get(
  "/doctor/daily",
  authenticate,
  authorize("DOCTOR"),
  getDoctorDailyAppointments
);

router.patch(
  "/:id/complete",
  authenticate,
  authorize("DOCTOR"),
  complete
);

router.get(
  "/admin/all",
  authenticate,
  authorize("ADMIN", "RECEPTIONIST"),
  getAllForAdmin
);

router.patch(
  "/:id/confirm",
  authenticate,
  authorize("ADMIN", "RECEPTIONIST"),
  confirm
);

router.patch(
  "/:id/staff-cancel",
  authenticate,
  authorize("ADMIN", "RECEPTIONIST"),
  cancelByStaff
);
export default router;