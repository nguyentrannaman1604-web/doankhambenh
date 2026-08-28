import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { getDoctorAvailability } from "../services/availabilityService.js";
import { AppError } from "../types/AppError.js";

export async function getAvailability(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const doctorId = Number(req.params.id);
    const date = req.query.date;

    if (!Number.isInteger(doctorId) || doctorId <= 0) {
      throw new AppError("Doctor ID không hợp lệ", 400);
    }

    if (typeof date !== "string" || !date) {
      throw new AppError(
        "Bạn phải truyền ngày theo định dạng YYYY-MM-DD",
        400
      );
    }

    const data = await getDoctorAvailability(
      doctorId,
      date
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}