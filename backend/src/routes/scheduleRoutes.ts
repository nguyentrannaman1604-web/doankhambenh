
import { Router } from "express";

import {
  getSchedules,
  createSchedule,
  updateSchedule,
  toggleSchedule,
  removeSchedule,
  getBlockedSlots,
  blockSlot,
  removeBlockedSlot,
} from "../controllers/scheduleController.js";

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
  "/blocked-slots",
  getBlockedSlots
);

router.post(
  "/blocked-slots",
  blockSlot
);

router.delete(
  "/blocked-slots/:id",
  removeBlockedSlot
);


router.get(
  "/",
  getSchedules
);

router.post(
  "/",
  createSchedule
);

router.patch(
  "/:id/toggle",
  toggleSchedule
);

router.patch(
  "/:id",
  updateSchedule
);

router.delete(
  "/:id",
  removeSchedule
);

export default router;