import { Router } from "express";

import {
  create,
   getByDoctor,
   update,
} from "../controllers/reviewController.js";

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
  "/doctor/:doctorId",
  getByDoctor
);

router.patch(
  "/:id",
  authenticate,
  authorize("PATIENT"),
  update
);

export default router;