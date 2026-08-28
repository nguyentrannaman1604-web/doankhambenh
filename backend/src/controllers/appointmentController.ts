import type { Request, Response, NextFunction } from "express";

import {
  createAppointment,
  getMyAppointments,
  cancelMyAppointment,
  getDoctorAppointmentsByDate,
  completeAppointment,
  getAllAppointments,
  confirmAppointment,
  cancelAppointmentByStaff,
} from "../services/appointmentService.js";

import { AppError } from "../types/AppError.js";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const patientId = req.user!.userId;

    const appointment = await createAppointment(patientId, req.body);

    return res.status(201).json({
      success: true,
      message: "Đặt lịch khám thành công",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMine(req: Request, res: Response, next: NextFunction) {
  try {
    const patientId = req.user!.userId;

    const appointments = await getMyAppointments(patientId);

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelMine(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const patientId = req.user!.userId;
    const appointmentId = Number(req.params.id);

    const appointment = await cancelMyAppointment(patientId, appointmentId);

    return res.status(200).json({
      success: true,
      message: "Hủy lịch hẹn thành công",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDoctorDailyAppointments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.userId;
    const date = req.query.date;

    if (typeof date !== "string" || !date) {
      throw new AppError("Bạn phải truyền ngày YYYY-MM-DD", 400);
    }

    const appointments = await getDoctorAppointmentsByDate(userId, date);

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
}

export async function complete(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.userId;
    const appointmentId = Number(req.params.id);

    const appointment = await completeAppointment(userId, appointmentId);

    return res.status(200).json({
      success: true,
      message: "Đã đánh dấu khám hoàn tất",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}


export async function getAllForAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const doctorId = req.query.doctorId
      ? Number(req.query.doctorId)
      : undefined;

    const date =
      typeof req.query.date === "string"
        ? req.query.date
        : undefined;

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : undefined;

    const appointments =
      await getAllAppointments({
        doctorId,
        date,
        status,
      });

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
}


export async function confirm(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    const appointment =
      await confirmAppointment(id);

    return res.status(200).json({
      success: true,
      message: "Xác nhận lịch hẹn thành công",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}


export async function cancelByStaff(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    const appointment =
      await cancelAppointmentByStaff(id);

    return res.status(200).json({
      success: true,
      message: "Hủy lịch hẹn thành công",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}