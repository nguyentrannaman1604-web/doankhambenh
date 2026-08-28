import { Router } from "express";

import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../controllers/doctorController.js";

import { authenticate, authorize } from "../middlewares/authMiddleware.js";

import { validateBody } from "../middlewares/validateBody.js";

import {
  createDoctorSchema,
  updateDoctorSchema,
} from "../schemas/doctorSchema.js";

import { getAvailability } from "../controllers/availabilityController.js";

const router = Router();


router.get("/", getAll);

router.get("/:id/availability", getAvailability);

router.get("/:id", getOne);


router.post(
  "/",
  authenticate,
  authorize("ADMIN", "RECEPTIONIST"),
  validateBody(createDoctorSchema),
  create,
);


router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN", "RECEPTIONIST"),
  validateBody(updateDoctorSchema),
  update,
);


router.delete("/:id", authenticate, authorize("ADMIN"), remove);

export default router;
