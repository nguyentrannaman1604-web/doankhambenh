import { Router } from "express";

import {
  getDoctorProfile,
  updateDoctorProfile,
} from "../controllers/doctorProfileController.js";

import {
  authenticate,
  authorize,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.use(
  authenticate,
  authorize("DOCTOR")
);

router.get(
  "/",
  getDoctorProfile
);

router.patch(
  "/",
  updateDoctorProfile
);

export default router;