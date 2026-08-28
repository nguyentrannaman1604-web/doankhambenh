import { Router } from "express";

import {
  register,
  login,
  refresh,
  logout,
  getMe,
} from "../controllers/authController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

import { validateBody } from "../middlewares/validateBody.js";

import { registerPatientSchema } from "../schemas/patientSchema.js";

import {
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from "../schemas/authSchema.js";

const router = Router();


router.post("/register", validateBody(registerPatientSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.post("/refresh", validateBody(refreshTokenSchema), refresh);

router.post("/logout", validateBody(logoutSchema), logout);

router.get("/me", authenticate, getMe);

export default router;
