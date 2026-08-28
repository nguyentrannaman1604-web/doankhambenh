import { Router } from "express";

import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../controllers/doctorController.js";

import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { getAvailability } from "../controllers/availabilityController.js";

const router = Router();

router.get("/", getAll);

router.get("/:id/availability", getAvailability);

router.get("/:id", getOne);

router.post("/", authenticate, authorize("ADMIN", "RECEPTIONIST"), create);

router.patch("/:id", authenticate, authorize("ADMIN", "RECEPTIONIST"), update);

router.delete("/:id", authenticate, authorize("ADMIN"), remove);

export default router;
