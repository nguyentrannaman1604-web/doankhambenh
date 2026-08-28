import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  getOverviewStatistics,
  getAppointmentsByDate,
  getTopDoctors,
} from "../services/statisticsService.js";

import { AppError } from "../types/AppError.js";

export async function overview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const statistics =
      await getOverviewStatistics();

    return res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    next(error);
  }
}

export async function appointmentsByDate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const date = req.query.date;

    if (
      typeof date !== "string" ||
      !date
    ) {
      throw new AppError(
        "Bạn phải truyền date theo định dạng YYYY-MM-DD",
        400
      );
    }

    const statistics =
      await getAppointmentsByDate(date);

    return res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    next(error);
  }
}

export async function topDoctors(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = req.query.limit
      ? Number(req.query.limit)
      : 5;

    const doctors =
      await getTopDoctors(limit);

    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
}