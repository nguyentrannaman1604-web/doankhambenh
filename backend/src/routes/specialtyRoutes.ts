import { Router } from "express";

import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../controllers/specialtyController.js";

import {
  authenticate,
  authorize,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", getOne);

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "RECEPTIONIST"),
  create
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN", "RECEPTIONIST"),
  update
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  remove
);

export default router;