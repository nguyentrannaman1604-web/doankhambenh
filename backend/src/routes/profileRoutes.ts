import { Router } from "express";

import { getProfile, updateProfile } from "../controllers/profileController.js";

import { authenticate, authorize } from "../middlewares/authMiddleware.js";

import { updatePatientProfileSchema } from "../schemas/patientSchema.js";

import { validateBody } from "../middlewares/validateBody.js";

const router = Router();

router.get("/", authenticate, authorize("PATIENT"), getProfile);

router.patch(
  "/",
  authenticate,
  authorize("PATIENT"),
  validateBody(updatePatientProfileSchema),
  updateProfile,
);

export default router;
