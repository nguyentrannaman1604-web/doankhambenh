import { Router } from "express";

import {
  suggest,
} from "../controllers/aiController.js";

import {
  authenticate,
  authorize,
} from "../middlewares/authMiddleware.js";

import {
  validateBody,
} from "../middlewares/validateBody.js";

import {
  suggestSpecialtySchema,
} from "../schemas/aiSchema.js";

const router = Router();

router.post(
  "/suggest-specialty",
  authenticate,
  authorize("PATIENT"),
  validateBody(suggestSpecialtySchema),
  suggest
);

export default router;